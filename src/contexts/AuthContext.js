import React, { createContext, useContext, useState, useEffect } from 'react';
import StorageService from '../services/StorageService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await StorageService.getItem('user');
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao verificar estado de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Aqui você implementaria a lógica de login real
      // Por enquanto, vamos simular um login
      const users = await StorageService.getItem('users') || [];
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await StorageService.setItem('user', userWithoutPassword);
        return { success: true };
      } else {
        return { success: false, error: 'Email ou senha incorretos' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  };

  const register = async (userData) => {
    try {
      const users = await StorageService.getItem('users') || [];
      
      // Verificar se o email já existe
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'Email já cadastrado' };
      }

      // Adicionar ID único
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await StorageService.setItem('users', users);

      // Fazer login automático após cadastro
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await StorageService.setItem('user', userWithoutPassword);

      return { success: true };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  };

  const logout = async () => {
    try {
      await StorageService.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      await StorageService.setItem('user', updatedUser);

      // Atualizar também na lista de usuários
      const users = await StorageService.getItem('users') || [];
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        await StorageService.setItem('users', users);
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

