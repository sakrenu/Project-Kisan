'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { app } from '../../../firebase.config';

const auth = getAuth(app);

export default function MobileOTPForm() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOTP = async () => {
    try {
      setError(null);
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      const formattedPhone = `+91${phone}`; // Assuming Indian numbers
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyOTP = async () => {
    try {
      setError(null);
      await confirmationResult.confirm(otp);
      // User is signed in, will be handled by auth state listener
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="otp-form">
      <div id="recaptcha-container"></div>
      
      {!isOtpSent ? (
        <>
          <div className="input-group">
            <label htmlFor="phone">{t('login.phone_label')}</label>
            <div className="phone-input">
              <span className="country-code">+91</span>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder={t('login.phone_placeholder')}
                maxLength="10"
              />
            </div>
          </div>
          <button onClick={handleSendOTP} className="auth-button">
            {t('login.send_otp')}
          </button>
        </>
      ) : (
        <>
          <div className="input-group">
            <label htmlFor="otp">{t('login.otp_label')}</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder={t('login.otp_placeholder')}
              maxLength="6"
            />
          </div>
          <button onClick={verifyOTP} className="auth-button">
            {t('login.verify_otp')}
          </button>
        </>
      )}
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}