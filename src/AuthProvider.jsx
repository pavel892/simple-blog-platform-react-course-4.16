import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState(null);
  const [userBio, setUserBio] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    const currentUser = localStorage.getItem('user');
    const currentUserName = localStorage.getItem('userName');
    const currentUserBio = localStorage.getItem('userBio');
    const currentImage = localStorage.getItem('image');
    if (currentToken) {
      setToken(currentToken);
    }
    if (currentUser) {
      setUser(currentUser);
    }
    if (currentUserName) {
      setUserName(currentUserName);
    }
    if (currentUserBio) {
      setUserBio(currentUserBio);
    }
    if (currentImage) {
      setImage(currentImage);
    }
    setIsLoading(false);
  }, []);

  const login = (user, newToken, userName, image, userBio) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', user);
    localStorage.setItem('userName', userName);
    localStorage.setItem('image', image);
    localStorage.setItem('userBio', userBio);
    setUserName(userName);
    setUser(user);
    setUserBio(userBio);
    setImage(image);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('image');
    localStorage.removeItem('userBio');
    setUserName('');
    setUser(null);
    setUserBio(null);
    setImage(null);
  };

  const updateProfile = (user, newToken, userName, image, userBio) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', user);
    localStorage.setItem('userName', userName);
    localStorage.setItem('image', image);
    localStorage.setItem('userBio', userBio);
    setUserName(userName);
    setUser(user);
    setUserBio(userBio);
    setImage(image);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        userName,
        token,
        userBio,
        image,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
