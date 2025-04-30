
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { app } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../services/firebase/config';
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
};

type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setUserAsAdmin: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

// Default admin email
const DEFAULT_ADMIN_EMAIL = "sonybabaoredy@gmail.com";

// Initialize Firebase Auth
const auth = getAuth(app);

// Helper function to convert Firebase user to our User type
const formatUser = async (user: FirebaseUser): Promise<User> => {
  // Fetch additional user data from Firestore (for admin status)
  let isAdmin = false;
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      isAdmin = userDoc.data()?.isAdmin === true;
    } else {
      // Si l'utilisateur n'existe pas dans Firestore mais que c'est l'admin par défaut,
      // créer son document avec le statut d'admin
      if (user.email === DEFAULT_ADMIN_EMAIL) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName || null,
          isAdmin: true,
          createdAt: serverTimestamp()
        });
        isAdmin = true;
      }
    }
  } catch (error) {
    console.error("Error fetching user admin status:", error);
    // Si l'utilisateur est l'admin par défaut, on lui donne le statut admin malgré l'erreur
    if (user.email === DEFAULT_ADMIN_EMAIL) {
      isAdmin = true;
    }
  }

  return {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || undefined,
    isAdmin: isAdmin || user.email === DEFAULT_ADMIN_EMAIL // Garantir que l'admin par défaut a toujours les droits
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to set a user as admin by email
  const setUserAsAdmin = async (email: string): Promise<boolean> => {
    try {
      // Si l'email est celle de l'admin par défaut, on garantit ses droits admin
      if (email === DEFAULT_ADMIN_EMAIL && currentUser && currentUser.email === DEFAULT_ADMIN_EMAIL) {
        // Si c'est l'utilisateur actuel, mettre à jour directement son document
        await setDoc(doc(db, "users", currentUser.id), {
          isAdmin: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        // Mettre à jour l'état local
        setCurrentUser({
          ...currentUser,
          isAdmin: true
        });
        
        toast({
          title: "Administrateur défini",
          description: "Votre compte est maintenant administrateur.",
        });
        
        return true;
      }
      
      // Pour les autres utilisateurs, rechercher par email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast({
          title: "Utilisateur non trouvé",
          description: `Aucun utilisateur avec l'email ${email} n'a été trouvé.`,
          variant: "destructive"
        });
        return false;
      }
      
      // Update the first matching user (emails should be unique)
      const userDoc = querySnapshot.docs[0];
      await setDoc(doc(db, "users", userDoc.id), {
        ...userDoc.data(),
        isAdmin: true,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      toast({
        title: "Administrateur défini",
        description: `L'utilisateur ${email} est maintenant administrateur.`,
      });
      
      // If the current user is the one being updated, refresh their status
      if (currentUser && currentUser.email === email) {
        setCurrentUser({
          ...currentUser,
          isAdmin: true
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error setting admin status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de définir le statut d'administrateur.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Check for default admin on first load
  useEffect(() => {
    const checkDefaultAdmin = async () => {
      if (!currentUser) return;
      
      // If the current user is the default admin email, make sure they have admin status
      if (currentUser.email === DEFAULT_ADMIN_EMAIL && !currentUser.isAdmin) {
        console.log("Setting default admin privileges for:", DEFAULT_ADMIN_EMAIL);
        // Au lieu d'utiliser setUserAsAdmin qui peut échouer à cause des règles de sécurité,
        // on met directement à jour le statut en local
        setCurrentUser({
          ...currentUser,
          isAdmin: true
        });
        
        // Et on essaie de mettre à jour dans Firestore
        try {
          await setDoc(doc(db, "users", currentUser.id), {
            isAdmin: true,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Error updating admin status in Firestore:", error);
          // L'échec de mise à jour dans Firestore n'est pas bloquant
          // puisqu'on a déjà mis à jour le statut en local
        }
      }
    };
    
    checkDefaultAdmin();
  }, [currentUser]);

  useEffect(() => {
    // Set up authentication state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const formattedUser = await formatUser(user);
        setCurrentUser(formattedUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const formattedUser = await formatUser(userCredential.user);
      setCurrentUser(formattedUser);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile if displayName is provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Check if this is the default admin email
      const isDefaultAdmin = email === DEFAULT_ADMIN_EMAIL;
      
      // Create a user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: displayName || null,
        isAdmin: isDefaultAdmin, // Set admin status based on email
        createdAt: serverTimestamp()
      });
      
      const formattedUser = await formatUser(userCredential.user);
      setCurrentUser(formattedUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin || false,
    login,
    signup,
    logout,
    loading,
    setUserAsAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
