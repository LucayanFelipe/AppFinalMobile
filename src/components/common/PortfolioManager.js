import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import ImageService from '../../services/ImageService';

const PortfolioManager = ({ userId, editable = true }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadPortfolioImages();
  }, [userId]);

  const loadPortfolioImages = async () => {
    try {
      const portfolioImages = await ImageService.getPortfolioImages(userId);
      setImages(portfolioImages);
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
    }
  };

  const handleAddImages = async () => {
    try {
      const maxImages = 10 - images.length;
      if (maxImages <= 0) {
        Alert.alert('Limite atingido', 'Você pode ter no máximo 10 imagens no portfólio');
        return;
      }

      const selectedImages = await ImageService.pickMultipleImages(maxImages);
      if (selectedImages.length > 0) {
        const newImageUris = selectedImages.map(img => img.uri);
        const updatedImages = [...images, ...newImageUris];
        
        const result = await ImageService.savePortfolioImages(userId, updatedImages);
        if (result.success) {
          setImages(updatedImages);
        } else {
          Alert.alert('Erro', result.error);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar as imagens');
    }
  };

  const handleRemoveImage = async (imageUri) => {
    Alert.alert(
      'Remover Imagem',
      'Tem certeza que deseja remover esta imagem do portfólio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const result = await ImageService.removePortfolioImage(userId, imageUri);
            if (result.success) {
              setImages(prev => prev.filter(uri => uri !== imageUri));
            } else {
              Alert.alert('Erro', result.error);
            }
          }
        }
      ]
    );
  };

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const renderImage = (imageUri, index) => (
    <TouchableOpacity
      key={index}
      style={styles.imageContainer}
      onPress={() => openImageModal(imageUri)}
    >
      <Image source={{ uri: imageUri }} style={styles.portfolioImage} />
      {editable && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveImage(imageUri)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Portfólio</Text>
        {editable && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddImages}>
            <Text style={styles.addButtonText}>+ Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>

      {images.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.imagesList}
        >
          {images.map(renderImage)}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🖼️</Text>
          <Text style={styles.emptyText}>
            {editable ? 'Adicione imagens do seu trabalho' : 'Nenhuma imagem no portfólio'}
          </Text>
          {editable && (
            <TouchableOpacity style={styles.emptyAddButton} onPress={handleAddImages}>
              <Text style={styles.emptyAddButtonText}>Adicionar Primeira Imagem</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal para visualizar imagem em tela cheia */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imagesList: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  portfolioImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  emptyAddButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '70%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

export default PortfolioManager;

