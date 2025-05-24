import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/VerifyEmailPage.css'; // Import your CSS styles

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [message, setMessage] = React.useState('Verifying your email...');
  const [isError, setIsError] = React.useState(false);
  const [fadeClass, setFadeClass] = React.useState('fade-in');

  React.useEffect(() => {
    if (token && email) {
      axios
        .post('http://localhost:5000/api/auth/verify-email', { token, email })
        .then((res) => {
          setMessage(res.data.message || 'Email verified successfully!');
          setIsError(false);

          // Fade out animation + redirect after 3s
          setTimeout(() => setFadeClass('fade-out'), 2500);
          setTimeout(() => navigate('/login'), 3000);
        })
        .catch((err) => {
          setMessage(err.response?.data?.message || 'Verification failed');
          setIsError(true);
        });
    } else {
      setMessage('Invalid verification link');
      setIsError(true);
    }
  }, [token, email, navigate]);

  return (
    <div className={`verify-email-container ${fadeClass}`}>
      <h1>Email Verification</h1>
      <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>
      {!isError && (
        <p className="redirect-note">
          You will be redirected to the login page shortly...
        </p>
      )}
    </div>
  );
};

export default VerifyEmailPage;
