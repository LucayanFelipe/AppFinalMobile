import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import CustomPicker from '../../components/common/CustomPicker';
import { STATES, CITIES_BY_STATE, PROFESSIONAL_CATEGORIES } from '../../utils/locations';

const RegisterProfessionalScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
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
  const { register } = useAuth();

  const handleInputChange = (field, value) => {
    // Aplicar máscara para CEP
    if (field === 'zipCode') {
      value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
      if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
      }
      if (value.length > 9) {
        value = value.substring(0, 9);
      }
    }
    
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
      'name', 'email', 'password', 'phone', 'category', 'description',
      'street', 'number', 'neighborhood', 'city', 'state', 'zipCode'
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
        return false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Erro', 'Por favor, digite um email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        ...formData,
        userType: 'professional',
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
      
      // Remove campos de endereço individuais
      delete userData.street;
      delete userData.number;
      delete userData.complement;
      delete userData.neighborhood;
      delete userData.city;
      delete userData.state;
      delete userData.zipCode;
      delete userData.confirmPassword;

      const result = await register(userData);
      if (!result.success) {
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
          <Text style={styles.title}>Cadastro de Profissional</Text>
          <Text style={styles.subtitle}>Preencha seus dados para oferecer seus serviços</Text>
        </View>

        <View style={styles.form}>
          {/* Dados Pessoais */}
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
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone/WhatsApp *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha *</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Digite sua senha"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha *</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirme sua senha"
              secureTextEntry
            />
          </View>

          {/* Dados Profissionais */}
          <Text style={styles.sectionTitle}>Dados Profissionais</Text>

          <CustomPicker
            label="Categoria *"
            selectedValue={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
            items={PROFESSIONAL_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
            placeholder="Selecione sua área de atuação"
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

          {/* Endereço */}
          <Text style={styles.sectionTitle}>Endereço</Text>

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
            label="Estado *"
            selectedValue={formData.state}
            onValueChange={handleStateChange}
            items={STATES}
            placeholder="Selecione o estado"
          />

          <CustomPicker
            label="Cidade *"
            selectedValue={formData.city}
            onValueChange={(value) => handleInputChange('city', value)}
            items={getCitiesForSelectedState()}
            placeholder={formData.state ? "Selecione a cidade" : "Primeiro selecione o estado"}
            disabled={!formData.state}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CEP *</Text>
            <TextInput
              style={styles.input}
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              placeholder="00000-000"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Cadastrando...' : 'Criar Conta Profissional'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Voltar para seleção de tipo</Text>
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
  registerButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
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

export default RegisterProfessionalScreen;

