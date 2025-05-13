import React, { useState, useEffect } from 'react';
import SideMenue from './components/side-menue';
import './App.scss';
import TrashMenue from './components/TrashMenue';
import Login from './components/Login';
import WebsiteControler from './components/websiteControler';

export default function App() {
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  // تحديث userType عند تغييره في localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      
      {userType === 'owner' ? (
        <SideMenue />
      ) : userType === 'Employee' ? (
        <TrashMenue />
      ) :
      userType === 'media' ? (
        <WebsiteControler />
      ):
      
      (
        <Login />
      )}
    </div>
  );
}
