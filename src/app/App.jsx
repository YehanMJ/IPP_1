import { useEffect, useState } from 'react'
import './App.css'
import Register from '../page/Register'
import { Navigate, Route, Routes } from 'react-router-dom'

import Products from '../page/Products/Products'
import Login from '../page/login'
import Dashboard from '../page/Dashboard/Dashboard'


function App() {

  const [login, setLogin] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLogin(!!token); // Update login state based on token presence

    const handleBeforeUnload = (event) => {
            localStorage.removeItem('token'); // Clear the token on browser exit
            event.preventDefault(); // Prevent default behavior (optional, for some browsers)
            event.returnValue = ''; // Required for Chrome to trigger the event
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
  }, []);

  return (
    <>
      <div>
        {login ? (
          <Dashboard setLogin={setLogin} />
        ) : (
          <Routes>
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login setLogin={setLogin} />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/products" element={<Products/>} /> */}
            <Route path="/dashboard" element={<Dashboard setLogin={setLogin} />} />
          </Routes>
        )}
      </div>
    </>
  )
}

export default App
