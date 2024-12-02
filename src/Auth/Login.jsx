import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    console.log('User Info: ', user);
  } catch (error) {
    console.error(error.message);
  }
};

const registerWithEmail = async (email, password) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      console.log('User registered');
    } catch (error) {
      console.error(error.message);
    }
  };

  
const loginWithEmail = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('User logged in');
    } catch (error) {
      console.error(error.message);
    }
  };
  

export {loginWithEmail,registerWithEmail,googleLogin}