import { jwtDecode } from 'jwt-decode';

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode(token); // içinde isSeller, isCustomer, id var
  } catch (err) {
    return null;
  }
};
