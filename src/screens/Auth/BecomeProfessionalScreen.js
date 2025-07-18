import React, { useState } from 'react';
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
import CustomPicker from '../../components/common/CustomPicker';
import { STATES, CITIES_BY_STATE, PROFESSIONAL_CATEGORIES } from '../../utils/locations';

const BecomeProfessionalScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    experience: '',
    // Endereço
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const getCitiesForSelectedState = () => {
    if (!formData.state) return [];
    const cities = CITIES_BY_STATE[formData.state] || [];
    return cities.map(city => ({ value: city, label: city }));
  };

  const validateForm = () => {
    const requiredFields = [
      'category', 'description', 'street', 'number', 
      'neighborhood', 'city', 'state', 'zipCode'
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedData = {
        userType: 'professional',
        category: formData.category,
        description: formData.description,
        experience: formData.experience,
        address: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        }
      };

      const result = await updateUser(updatedData);
      if (result.success) {
        Alert.alert(
          'Sucesso!', 
          'Parabéns! Agora você é um profissional cadastrado na plataforma!',
          [
            { text: 'OK', onPress: () => navigation.navigate('Profile') }
          ]
        );
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
          <Text style={styles.title}>Tornar-se Profissional</Text>
          <Text style={styles.subtitle}>
            Complete seus dados profissionais para começar a oferecer seus serviços
          </Text>
        </View>

        <View style={styles.form}>
          {/* Dados Profissionais */}
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
              placeholder="Descreva detalhadamente os serviços que você oferece"
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
              placeholder="Ex: 5 anos de experiência na área"
            />
          </View>

          {/* Endereço */}
          <Text style={styles.sectionTitle}>Endereço de Atendimento</Text>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.flex1]}>
              <Text style={styles.label}>Rua *</Text>
              <TextInput
                style={styles.input}
                value={formData.street}
                onChangeText={(value) => handleInputChange('street', value)}
                placeholder="Nome da rua"
              />
            </View>
            <View style={[styles.inputContainer, styles.flex0]}>
              <Text style={styles.label}>Número *</Text>
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
            <Text style={styles.label}>Bairro *</Text>
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
            required
          />

          <CustomPicker
            label="Cidade"
            selectedValue={formData.city}
            onValueChange={(value) => handleInputChange('city', value)}
            items={getCitiesForSelectedState()}
            placeholder={formData.state ? "Selecione a cidade" : "Primeiro selecione o estado"}
            required
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CEP *</Text>
            <TextInput
              style={styles.input}
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              placeholder="00000-000"
              keyboardType="numeric"
              maxLength={8}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Processando...' : 'Tornar-se Profissional'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Voltar ao perfil</Text>
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
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
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
    backgroundColor: '#fff',
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
  submitButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  backLink: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
});

export default BecomeProfessionalScreen;

