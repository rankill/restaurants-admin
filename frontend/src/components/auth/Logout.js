import React, { useEffect } from 'react';
import { useAuthState } from '../../contexts/AuthContext';

export default function Logout({ history }) {
  const { logOut } = useAuthState();
  useEffect(() => {
    logOut();
    history.push('/login');
  });

  return (
    <div></div>
  );
}
