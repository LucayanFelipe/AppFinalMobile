import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import StorageService from './src/services/StorageService';
import 'react-native-gesture-handler';
import { setBackgroundColorAsync } from 'expo-system-ui';

setBackgroundColorAsync('#ffffff'); // força fundo branco

export default function App() {
  useEffect(() => {
    // Inicializar dados quando o app carrega
    const initializeApp = async () => {
      try {
        await StorageService.initializeData();
        console.log('Dados inicializados com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#007bff" />
      <AppNavigator />
    </AuthProvider>
  );
}
