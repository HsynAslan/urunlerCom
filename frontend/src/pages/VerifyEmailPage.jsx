import React from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [message, setMessage] = React.useState('Verifying...');

  React.useEffect(() => {
    if (token && email) {
      axios.post('http://localhost:5000/api/auth/verify-email', { token, email })
        .then(res => setMessage(res.data.message || 'Email verified successfully!'))
        .catch(err => setMessage(err.response?.data?.message || 'Verification failed'));
    } else {
      setMessage('Invalid verification link');
    }
  }, [token, email]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmailPage;
