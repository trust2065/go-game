import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

// 請替換成你自己的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyCChK4UNIcsIVj9NY9rmoPIWzPvsrppYn4",
  authDomain: "go-game-57678.firebaseapp.com",
  projectId: "go-game-57678",
  storageBucket: "go-game-57678.firebasestorage.app",
  messagingSenderId: "926953027570",
  appId: "1:926953027570:web:5fd74f0c0f80ae52299d6b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const saveGameToFirebase = async (title: string, history: any[]) => {
  try {
    const serializedHistory = history.map(state => ({
      ...state,
      board: JSON.stringify(state.board)
    }));

    const docRef = await addDoc(collection(db, 'go_games'), {
      title,
      history: serializedHistory,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const updateGameInFirebase = async (id: string, title: string, history: any[]) => {
  try {
    const serializedHistory = history.map(state => ({
      ...state,
      board: JSON.stringify(state.board)
    }));

    const docRef = doc(db, 'go_games', id);
    await updateDoc(docRef, {
      title,
      history: serializedHistory,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const fetchGamesFromFirebase = async () => {
  try {
    const q = query(collection(db, 'go_games'), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const parsedHistory = data.history?.map((state: any) => ({
        ...state,
        board: typeof state.board === 'string' ? JSON.parse(state.board) : state.board
      })) || [];

      return {
        id: doc.id,
        ...data,
        history: parsedHistory
      };
    });
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e;
  }
};
