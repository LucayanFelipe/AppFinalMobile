import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  static async initializeData() {
    try {
      console.log('Inicializando dados do app...');
      // Aqui podemos inicializar dados padrão se necessário
      return true;
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      throw error;
    }
  }

  static async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      throw error;
    }
  }

  static async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Erro ao recuperar item:', error);
      throw error;
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    }
  }
}

export default StorageService;

