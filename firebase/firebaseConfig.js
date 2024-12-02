import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDX_iGQGzR0y9wly2l5Ls_uQTdo9XV0iZM",
  authDomain: "example-ab748.firebaseapp.com",
  projectId: "example-ab748",
  storageBucket: "example-ab748.firebasestorage.app",
  messagingSenderId: "936333105349",
  appId: "1:936333105349:web:0d51fb156ed8e3a58038ac",
  measurementId: "G-ZHM0YNNNH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
