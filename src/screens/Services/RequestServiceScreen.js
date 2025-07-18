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
import ProfessionalService from '../../services/ProfessionalService';

const RequestServiceScreen = ({ route, navigation }) => {
  const { professionalId } = route.params;
  const { user } = useAuth();
  const [professional, setProfessional] = useState(null);
  const [formData, setFormData] = useState({
    serviceDescription: '',
    serviceValue: '',
    additionalNotes: '',
    urgency: 'normal'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfessionalData();
  }, [professionalId]);

  const loadProfessionalData = async () => {
    try {
      const professionalData = await ProfessionalService.getProfessionalById(professionalId);
      setProfessional(professionalData);
    } catch (error) {
      console.error('Erro ao carregar dados do profissional:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do profissional');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.serviceDescription.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o serviço que você precisa');
      return false;
    }

    if (!formData.serviceValue.trim()) {
      Alert.alert('Erro', 'Por favor, informe o valor do serviço');
      return false;
    }

    const value = parseFloat(formData.serviceValue.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      Alert.alert('Erro', 'Por favor, informe um valor válido');
      return false;
    }

    return true;
  };

  const handleSubmitRequest = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const serviceRequest = {
        id: Date.now().toString(),
        clientId: user.id,
        clientName: user.name,
        professionalId: professional.id,
        professionalName: professional.name,
        serviceDescription: formData.serviceDescription,
        serviceValue: parseFloat(formData.serviceValue.replace(',', '.')),
        additionalNotes: formData.additionalNotes,
        urgency: formData.urgency,
        status: 'pending', // pending, accepted, completed, cancelled
        requestDate: new Date().toISOString(),
        completedDate: null,
        rating: null,
        comment: null
      };

      const result = await ProfessionalService.addServiceRequest(serviceRequest);
      
      if (result.success) {
        Alert.alert(
          'Sucesso!',
          'Sua solicitação de serviço foi enviada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      Alert.alert('Erro', 'Não foi possível enviar a solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^0-9,]/g, '');
    return numericValue;
  };

  const urgencyOptions = [
    { value: 'low', label: 'Baixa - Posso aguardar alguns dias', color: '#28a745' },
    { value: 'normal', label: 'Normal - Dentro de alguns dias', color: '#007bff' },
    { value: 'high', label: 'Alta - Preciso em breve', color: '#ffc107' },
    { value: 'urgent', label: 'Urgente - Preciso hoje/amanhã', color: '#dc3545' }
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Solicitar Serviço</Text>
          <Text style={styles.subtitle}>
            Você está solicitando um serviço para: {professional?.name}
          </Text>
          <Text style={styles.category}>
            Categoria: {professional?.category}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição do Serviço *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.serviceDescription}
              onChangeText={(value) => handleInputChange('serviceDescription', value)}
              placeholder="Descreva detalhadamente o serviço que você precisa..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor do Serviço (R$) *</Text>
            <TextInput
              style={styles.input}
              value={formData.serviceValue}
              onChangeText={(value) => handleInputChange('serviceValue', formatCurrency(value))}
              placeholder="Ex: 150,00"
              keyboardType="numeric"
            />
            <Text style={styles.helpText}>
              Informe o valor que você está disposto a pagar pelo serviço
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Urgência do Serviço</Text>
            <View style={styles.urgencyContainer}>
              {urgencyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.urgencyOption,
                    formData.urgency === option.value && styles.urgencyOptionSelected,
                    { borderColor: option.color }
                  ]}
                  onPress={() => handleInputChange('urgency', option.value)}
                >
                  <View style={[styles.urgencyIndicator, { backgroundColor: option.color }]} />
                  <Text style={[
                    styles.urgencyText,
                    formData.urgency === option.value && styles.urgencyTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Observações Adicionais</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.additionalNotes}
              onChangeText={(value) => handleInputChange('additionalNotes', value)}
              placeholder="Informações adicionais, horários preferenciais, etc..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Como funciona?</Text>
            <Text style={styles.infoText}>
              • Sua solicitação será enviada para o profissional{'\n'}
              • O profissional poderá aceitar ou recusar o serviço{'\n'}
              • Após a conclusão, você poderá avaliar o serviço{'\n'}
              • O pagamento é combinado diretamente com o profissional
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmitRequest}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
            </Text>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  urgencyContainer: {
    gap: 10,
  },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  urgencyOptionSelected: {
    backgroundColor: '#e3f2fd',
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  urgencyText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  urgencyTextSelected: {
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestServiceScreen;

