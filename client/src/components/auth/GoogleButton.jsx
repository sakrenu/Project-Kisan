'use client';
import { useTranslation } from 'react-i18next';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../../../firebase.config';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function GoogleButton() {
  const { t } = useTranslation();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      // User is signed in, will be handled by auth state listener
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <button onClick={signInWithGoogle} className="google-button">
      <span className="google-icon"></span>
      {t('login.signin_with_google')}
    </button>
  );
}