import { useState, useEffect } from 'react';

// Retrieves the value from local storage using localStorage.getItem("persist").
// Sets the initial state of the persist state variable using useState.
const usePersist = () => {
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem('persist')) || false
  );

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};
export default usePersist;

// Persists a boolean value (e.g., a user preference) in local storage, ensuring its persistence across page refreshes or browser sessions.
