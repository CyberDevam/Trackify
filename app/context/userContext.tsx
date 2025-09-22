// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// // Create the context
// const UserContext = createContext();

// // Create a custom hook to use the context
// export const useUser = () => useContext(UserContext);

// // Create the provider component
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // This useEffect will fetch the user data when the app loads
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.post("http://10.60.154.236:4000/api/auth/prof/me", {
//           id: "68ccc8cc5e37188725e240d4" // This should be a dynamic ID from your login
//         });
//         setUser(res.data.user); // Store only the nested user object
//       } catch (error) {
//         console.error("Error fetching user data:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, loading, setUser, setLoading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };



// contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ip, setIp] = useState("10.34.160.236");
  // Function to fetch user data
  const fetchUser = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`http://${ip}:4000/api/auth/profile/me`, {
        id: userId
      });

      setUser(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear user data (logout)
  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    error,
    fetchUser,
    clearUser,
    ip
  }), [user, loading, error, ip]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;