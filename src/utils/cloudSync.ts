import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let db: any = null;

export function getFirestoreDb(): any {
  if (db) return db;
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      console.log('⚠️ [CloudSync] firebase-applet-config.json not found. Offline fallback mode active.');
      return null;
    }
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    console.log('✅ [CloudSync] Connected to Firestore for resilient cloud backup.');
    return db;
  } catch (error) {
    console.error('❌ [CloudSync] Failed to initialize Firebase:', error);
    return null;
  }
}

// Map a filename to a Firestore collection
function getCollectionName(filePath: string): string {
  const base = path.basename(filePath);
  if (base === 'users.json') return 'dih_v3_users';
  if (base === 'settings.json') return 'dih_v3_settings';
  if (base === 'store.json') return 'dih_v3_store';
  if (base === 'logs.json') return 'dih_v3_logs';
  if (base === 'migrations.json') return 'dih_v3_migrations';
  if (base === 'hostinger_data.json') return 'dih_v3_hostinger';
  return 'dih_v3_unknown';
}

/**
 * Perform a two-way sync between a local JSON file and its Firestore collection.
 * This helper ensures that:
 * 1. Missing items in local files are fetched from the cloud.
 * 2. Missing items in the cloud are uploaded from local files.
 * 3. Standard collections are merged based on unique ID field.
 * 4. Single-document objects (like settings.json) resolve automatically.
 */
export async function syncFileWithCloud(filePath: string, defaultVal: any = []): Promise<any> {
  const firestoreDb = getFirestoreDb();
  if (!firestoreDb) return loadLocalData(filePath, defaultVal);

  const collectionName = getCollectionName(filePath);
  const isSingleDoc = collectionName === 'dih_v3_settings';
  
  try {
    const localData = loadLocalData(filePath, defaultVal);

    if (isSingleDoc) {
      // Single Document Sync (like settings.json)
      const docRef = doc(firestoreDb, collectionName, 'app_config');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        // If local is empty or older, we use cloud. Otherwise we use local and upload to cloud
        if (!localData || Object.keys(localData).length === 0) {
          console.log(`📥 [CloudSync] Restored ${collectionName} settings from Cloud!`);
          saveLocalData(filePath, cloudData);
          return cloudData;
        } else {
          // Sync local to cloud
          await setDoc(docRef, localData);
          return localData;
        }
      } else if (localData && Object.keys(localData).length > 0) {
        // Upload local to cloud if cloud does not exist
        await setDoc(docRef, localData);
        return localData;
      }
      return localData;
    } else {
      // Array Sync (users, store, logs, etc.)
      const colRef = collection(firestoreDb, collectionName);
      const querySnapshot = await getDocs(colRef);
      
      const cloudItems: any[] = [];
      querySnapshot.forEach((doc) => {
        cloudItems.push({ id: doc.id, ...doc.data() });
      });

      // Merge arrays using 'id'
      const mergedMap = new Map<string, any>();

      // Load cloud items first
      cloudItems.forEach((item) => {
        mergedMap.set(item.id, item);
      });

      // Overlay local items. If local has new or modified items, map them
      let localHasNew = false;
      if (Array.isArray(localData)) {
        localData.forEach((item) => {
          if (!item.id) {
            item.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
          }
          const exists = mergedMap.has(item.id);
          if (!exists) {
            localHasNew = true;
          }
          // Merge / update
          mergedMap.set(item.id, { ...mergedMap.get(item.id), ...item });
        });
      }

      const mergedData = Array.from(mergedMap.values());

      // Upload newly merged items to cloud
      for (const item of mergedData) {
        const cloudItem = cloudItems.find(c => c.id === item.id);
        if (!cloudItem || JSON.stringify(cloudItem) !== JSON.stringify(item)) {
          const docRef = doc(firestoreDb, collectionName, item.id);
          await setDoc(docRef, item);
        }
      }

      // Save the complete merged data locally
      saveLocalData(filePath, mergedData);
      console.log(`✅ [CloudSync] Completed sync for ${collectionName}. Record count: ${mergedData.length}`);
      return mergedData;
    }
  } catch (error) {
    console.error(`❌ [CloudSync] Detailed error syncing ${collectionName}:`, error);
    return loadLocalData(filePath, defaultVal);
  }
}

/**
 * Save data to Firestore asynchronously. 
 * This is called in background when standard client mutations happen.
 */
export async function saveToCloud(filePath: string, data: any): Promise<void> {
  const firestoreDb = getFirestoreDb();
  if (!firestoreDb) return;

  const collectionName = getCollectionName(filePath);
  const isSingleDoc = collectionName === 'dih_v3_settings';

  try {
    if (isSingleDoc) {
      const docRef = doc(firestoreDb, collectionName, 'app_config');
      await setDoc(docRef, data);
    } else if (Array.isArray(data)) {
      // Syncing an array. First, get list of current cloud items to determine deletions
      const colRef = collection(firestoreDb, collectionName);
      const querySnapshot = await getDocs(colRef);
      const cloudIds: string[] = [];
      querySnapshot.forEach((doc) => {
        cloudIds.push(doc.id);
      });

      const localIds = new Set(data.map(item => item.id).filter(Boolean));

      // 1. Delete items from cloud that are NOT in local array anymore
      for (const cid of cloudIds) {
        if (!localIds.has(cid)) {
          const docRef = doc(firestoreDb, collectionName, cid);
          await deleteDoc(docRef);
          console.log(`🗑️ [CloudSync] Deleted ${cid} from cloud collection: ${collectionName}`);
        }
      }

      // 2. Upload/update local items to cloud
      for (const item of data) {
        if (item && item.id) {
          const docRef = doc(firestoreDb, collectionName, item.id);
          await setDoc(docRef, item);
        }
      }
    }
  } catch (error) {
    console.error(`❌ [CloudSync] Failed to save update to cloud for ${collectionName}:`, error);
  }
}

// Standard file system fallbacks
function loadLocalData(file: string, defaultVal: any) {
  if (!fs.existsSync(file)) return defaultVal;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return defaultVal;
  }
}

function saveLocalData(file: string, data: any) {
  try {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Local write failed:", e);
  }
}
