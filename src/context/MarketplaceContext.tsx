import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initializeApp 
} from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  where, 
  orderBy, 
  serverTimestamp, 
  getDoc,
  setDoc,
  collectionGroup,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  location: string;
  rating: number;
  image: string;
  ownerId: string;
  ownerName: string;
  description: string;
  specs: string[];
}

export interface Booking {
  id: string;
  itemId: string;
  renterId: string;
  ownerId: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  createdAt?: any;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface ChatThread {
  id: string;
  itemId: string;
  participantIds: string[];
  lastMessageAt: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface MarketplaceContextType {
  items: Item[];
  bookings: Booking[];
  messages: Message[];
  threads: ChatThread[];
  currentUser: UserProfile | null;
  loading: boolean;
  addItem: (item: Omit<Item, 'id' | 'rating' | 'ownerId' | 'ownerName'>) => Promise<void>;
  bookItem: (itemId: string, startDate: string, endDate: string) => Promise<void>;
  sendMessage: (threadId: string, text: string) => Promise<void>;
  startThread: (itemId: string, otherUserId: string) => Promise<string>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null) => {
  if (error?.code === 'permission-denied' || error?.message?.includes('insufficient permissions')) {
    const info: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: {
        userId: auth.currentUser?.uid || 'unauthenticated',
        email: auth.currentUser?.email || 'N/A',
        emailVerified: auth.currentUser?.emailVerified || false,
        isAnonymous: auth.currentUser?.isAnonymous || false,
        providerInfo: auth.currentUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    console.error("Firestore Permission Denied:", JSON.stringify(info, null, 2));
    throw new Error(JSON.stringify(info));
  }
  throw error;
};

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const profile: UserProfile = {
            id: user.uid,
            name: user.displayName || 'Anonymous User',
            email: user.email || '',
            photoURL: user.photoURL || undefined
          };
          setCurrentUser(profile);
          
          // Sync user to Firestore
          await setDoc(doc(db, 'users', user.uid), {
            ...profile,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        // Handle potential permission error on users collection
        console.error("Error syncing user profile:", error);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Items Listener
  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      setItems(itemsList);
      
      // Seed initial data if empty and we have an authenticated user
      // Security rules now require isOwner(userId) for items creation
      if (snapshot.empty && !loading && auth.currentUser) {
        seedInitialData(auth.currentUser);
      }
    }, (error) => {
      console.error("Items listener error:", error);
    });
    return unsubscribe;
  }, [loading]);

  const seedInitialData = async (user: FirebaseUser) => {
    const initialItems = [
      {
        name: 'Sony A7IV Mirrorless',
        category: 'Camera',
        price: 4500,
        location: 'Bashundhara, Dhaka',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
        ownerId: user.uid,
        ownerName: user.displayName || 'Tahmid Ahmed',
        description: 'Professional grade full-frame mirrorless camera. Perfect for high-end cinematography and photography.',
        specs: ['33MP Full-Frame Exmor R CMOS', '4K 60p 10-bit Recording', 'S-Cinetone Color Science', 'Dual Card Slots']
      },
      {
        name: 'DJI Mavic 3 Pro',
        category: 'Drone',
        price: 6500,
        location: 'Banani, Dhaka',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
        ownerId: user.uid,
        ownerName: user.displayName || 'Zayed Khan',
        description: 'The ultimate consumer drone with a triple camera system. Capture stunning aerial footage.',
        specs: ['Hasselblad Main Camera', '43 Min Flight Time', '15km Transmission Range', 'Omnidirectional Obstacle Sensing']
      }
    ];

    try {
      for (const item of initialItems) {
        await addDoc(collection(db, 'items'), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, 'create', 'items');
    }
  };

  // Bookings Listener
  useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      return;
    }
    const q = query(
      collection(db, 'bookings'), 
      where('renterId', '==', currentUser.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(bookingsList);
    }, (error) => {
      console.error("Bookings listener error:", error);
    });
    return unsubscribe;
  }, [currentUser]);

  // Threads Listener
  useEffect(() => {
    if (!currentUser) {
      setThreads([]);
      return;
    }
    const q = query(
      collection(db, 'threads'),
      where('participantIds', 'array-contains', currentUser.id),
      orderBy('lastMessageAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threadsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatThread));
      setThreads(threadsList);
    }, (error) => {
      console.error("Threads listener error:", error);
    });
    return unsubscribe;
  }, [currentUser]);

  // Messages Listener (Per Thread)
  useEffect(() => {
    if (!currentUser || threads.length === 0) {
      setMessages([]);
      return;
    }

    // Instead of collectionGroup (which requires indexing and special rules),
    // we listen to messages for each thread the user is participant in.
    const unsubscribes = threads.map(thread => {
      const q = query(collection(db, 'threads', thread.id, 'messages'), orderBy('timestamp', 'asc'));
      return onSnapshot(q, (snapshot) => {
        const threadMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        setMessages(prev => {
          // Remove old messages for this thread and add new ones
          const otherMsgs = prev.filter(m => m.threadId !== thread.id);
          const allMsgs = [...otherMsgs, ...threadMsgs].sort((a, b) => a.timestamp - b.timestamp);
          return allMsgs;
        });
      }, (error) => {
        console.error(`Messages listener error for thread ${thread.id}:`, error);
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [currentUser, threads]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setMessages([]);
      setThreads([]);
      setBookings([]);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const addItem = async (itemData: Omit<Item, 'id' | 'rating' | 'ownerId' | 'ownerName'>) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'items'), {
        ...itemData,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        rating: 5.0,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, 'create', 'items');
    }
  };

  const bookItem = async (itemId: string, startDate: string, endDate: string) => {
    if (!currentUser) return;
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const bookingData = {
        itemId,
        renterId: currentUser.id,
        ownerId: item.ownerId,
        status: 'confirmed',
        startDate,
        endDate,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'bookings'), bookingData);

      // Start chat thread after booking
      const threadId = await startThread(itemId, item.ownerId);
      await sendMessage(threadId, `Hi ${item.ownerName}, I've just booked your ${item.name}! Looking forward to it.`);
    } catch (error) {
      handleFirestoreError(error, 'create', 'bookings');
    }
  };

  const startThread = async (itemId: string, otherUserId: string) => {
    if (!currentUser) throw new Error("Not authenticated");
    
    // Check if thread already exists
    const existing = threads.find(t => 
      t.itemId === itemId && 
      t.participantIds.includes(currentUser.id) && 
      t.participantIds.includes(otherUserId)
    );
    if (existing) return existing.id;

    try {
      const threadData = {
        itemId,
        participantIds: [currentUser.id, otherUserId],
        lastMessageAt: Date.now()
      };
      const docRef = await addDoc(collection(db, 'threads'), threadData);
      return docRef.id;
    } catch (error) {
      return handleFirestoreError(error, 'create', 'threads');
    }
  };

  const sendMessage = async (threadId: string, text: string) => {
    if (!currentUser) return;
    try {
      const messageData = {
        threadId,
        senderId: currentUser.id,
        text,
        timestamp: Date.now()
      };
      await addDoc(collection(db, 'threads', threadId, 'messages'), messageData);
      
      // Update thread lastMessageAt
      await updateDoc(doc(db, 'threads', threadId), {
        lastMessageAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, 'create', `threads/${threadId}/messages`);
    }
  };


  return (
    <MarketplaceContext.Provider value={{ 
      items, 
      bookings, 
      messages, 
      threads, 
      currentUser, 
      loading,
      addItem, 
      bookItem, 
      sendMessage, 
      startThread,
      login,
      logout
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider');
  return context;
};
