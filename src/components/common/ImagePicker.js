import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import ImageService from '../../services/ImageService';

const ImagePickerComponent = ({ 
  imageUri, 
  onImageSelected, 
  placeholder = "Adicionar Foto",
  style,
  imageStyle,
  isProfile = false 
}) => {
  const handleImagePick = async () => {
    try {
      const options = isProfile ? {
        aspect: [1, 1],
        allowsEditing: true,
      } : {
        allowsEditing: false,
      };

      const image = await ImageService.pickImage(options);
      if (image) {
        onImageSelected(image.uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handleImagePick}
    >
      {imageUri ? (
        <Image 
          source={{ uri: imageUri }} 
          style={[styles.image, imageStyle]} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, imageStyle]}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ImagePickerComponent;

