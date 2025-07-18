import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import StorageService from './StorageService';

class ImageService {
  static async requestPermissions() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar sua galeria de fotos.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  static async pickImage(options = {}) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const defaultOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      const result = await ImagePicker.launchImageLibraryAsync({
        ...defaultOptions,
        ...options,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
      return null;
    }
  }

  static async pickMultipleImages(maxImages = 5) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return [];

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: maxImages,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        return result.assets;
      }

      return [];
    } catch (error) {
      console.error('Erro ao selecionar imagens:', error);
      Alert.alert('Erro', 'Não foi possível selecionar as imagens');
      return [];
    }
  }

  static async saveProfileImage(userId, imageUri) {
    try {
      const profileImages = await StorageService.getItem('profileImages') || {};
      profileImages[userId] = imageUri;
      await StorageService.setItem('profileImages', profileImages);
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar foto de perfil:', error);
      return { success: false, error: 'Erro ao salvar foto de perfil' };
    }
  }

  static async getProfileImage(userId) {
    try {
      const profileImages = await StorageService.getItem('profileImages') || {};
      return profileImages[userId] || null;
    } catch (error) {
      console.error('Erro ao recuperar foto de perfil:', error);
      return null;
    }
  }

  static async savePortfolioImages(userId, imageUris) {
    try {
      const portfolios = await StorageService.getItem('portfolios') || {};
      portfolios[userId] = imageUris;
      await StorageService.setItem('portfolios', portfolios);
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar portfólio:', error);
      return { success: false, error: 'Erro ao salvar portfólio' };
    }
  }

  static async getPortfolioImages(userId) {
    try {
      const portfolios = await StorageService.getItem('portfolios') || {};
      return portfolios[userId] || [];
    } catch (error) {
      console.error('Erro ao recuperar portfólio:', error);
      return [];
    }
  }

  static async addPortfolioImage(userId, imageUri) {
    try {
      const currentImages = await this.getPortfolioImages(userId);
      const updatedImages = [...currentImages, imageUri];
      return await this.savePortfolioImages(userId, updatedImages);
    } catch (error) {
      console.error('Erro ao adicionar imagem ao portfólio:', error);
      return { success: false, error: 'Erro ao adicionar imagem ao portfólio' };
    }
  }

  static async removePortfolioImage(userId, imageUri) {
    try {
      const currentImages = await this.getPortfolioImages(userId);
      const updatedImages = currentImages.filter(uri => uri !== imageUri);
      return await this.savePortfolioImages(userId, updatedImages);
    } catch (error) {
      console.error('Erro ao remover imagem do portfólio:', error);
      return { success: false, error: 'Erro ao remover imagem do portfólio' };
    }
  }

  static getDefaultProfileImage() {
    // Retorna uma URI de imagem padrão ou null
    return null;
  }
}

export default ImageService;

