import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import ImageService from '../../services/ImageService';
import ImagePickerComponent from '../../components/common/ImagePicker';
import CustomPicker from '../../components/common/CustomPicker';
import { STATES, CITIES_BY_STATE, PROFESSIONAL_CATEGORIES } from '../../utils/locations';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '',
    description: '',
    experience: '',
    // Endereço (apenas para profissionais)
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
    loadProfileImage();
  }, [user]);

  const loadUserData = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        category: user.category || '',
        description: user.description || '',
        experience: user.experience || '',
        // Endereço
        street: user.address?.street || '',
        number: user.address?.number || '',
        complement: user.address?.complement || '',
        neighborhood: user.address?.neighborhood || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || ''
      });
    }
  };

  const loadProfileImage = async () => {
    if (user?.id) {
      const imageUri = await ImageService.getProfileImage(user.id);
      setProfileImage(imageUri);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStateChange = (state) => {
    setFormData(prev => ({
      ...prev,
      state,
      city: '' // Reset city when state changes
    }));
  };

  const handleImageSelected = async (imageUri) => {
    setProfileImage(imageUri);
    if (user?.id) {
      await ImageService.saveProfileImage(user.id, imageUri);
    }
  };

  const getCitiesForSelectedState = () => {
    if (!formData.state) return [];
    const cities = CITIES_BY_STATE[formData.state] || [];
    return cities.map(city => ({ value: city, label: city }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }

    if (user?.userType === 'professional') {
      if (!formData.category) {
        Alert.alert('Erro', 'Categoria é obrigatória para profissionais');
        return false;
      }
      if (!formData.description.trim()) {
        Alert.alert('Erro', 'Descrição dos serviços é obrigatória');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedData = {
        name: formData.name,
        phone: formData.phone,
      };

      if (user?.userType === 'professional') {
        updatedData.category = formData.category;
        updatedData.description = formData.description;
        updatedData.experience = formData.experience;

        // Atualizar endereço se algum campo foi preenchido
        if (formData.street || formData.city || formData.state) {
          updatedData.address = {
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          };
        }
      }

      const result = await updateUser(updatedData);
      if (result.success) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro interno do sistema');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Perfil</Text>
        </View>

        {/* Foto de Perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto de Perfil</Text>
          <View style={styles.imagePickerContainer}>
            <ImagePickerComponent
              imageUri={profileImage}
              onImageSelected={handleImageSelected}
              placeholder="Adicionar Foto"
              isProfile={true}
            />
          </View>
        </View>

        {/* Dados Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Digite seu nome completo"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Dados Profissionais (apenas para profissionais) */}
        {user?.userType === 'professional' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados Profissionais</Text>

              <CustomPicker
                label="Categoria"
                selectedValue={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                items={PROFESSIONAL_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                placeholder="Selecione sua área de atuação"
                required
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Descrição dos Serviços *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(value) => handleInputChange('description', value)}
                  placeholder="Descreva os serviços que você oferece"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Experiência</Text>
                <TextInput
                  style={styles.input}
                  value={formData.experience}
                  onChangeText={(value) => handleInputChange('experience', value)}
                  placeholder="Ex: 5 anos de experiência"
                />
              </View>
            </View>

            {/* Endereço */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Endereço</Text>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.flex1]}>
                  <Text style={styles.label}>Rua</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.street}
                    onChangeText={(value) => handleInputChange('street', value)}
                    placeholder="Nome da rua"
                  />
                </View>
                <View style={[styles.inputContainer, styles.flex0]}>
                  <Text style={styles.label}>Número</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.number}
                    onChangeText={(value) => handleInputChange('number', value)}
                    placeholder="123"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Complemento</Text>
                <TextInput
                  style={styles.input}
                  value={formData.complement}
                  onChangeText={(value) => handleInputChange('complement', value)}
                  placeholder="Apto, casa, etc."
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput
                  style={styles.input}
                  value={formData.neighborhood}
                  onChangeText={(value) => handleInputChange('neighborhood', value)}
                  placeholder="Nome do bairro"
                />
              </View>

              <CustomPicker
                label="Estado"
                selectedValue={formData.state}
                onValueChange={handleStateChange}
                items={STATES}
                placeholder="Selecione o estado"
              />

              <CustomPicker
                label="Cidade"
                selectedValue={formData.city}
                onValueChange={(value) => handleInputChange('city', value)}
                items={getCitiesForSelectedState()}
                placeholder={formData.state ? "Selecione a cidade" : "Primeiro selecione o estado"}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>CEP</Text>
                <TextInput
                  style={styles.input}
                  value={formData.zipCode}
                  onChangeText={(value) => handleInputChange('zipCode', value)}
                  placeholder="00000-000"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 5,
  },
  imagePickerContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  flex0: {
    width: 80,
  },
  actions: {
    marginTop: 20,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;

