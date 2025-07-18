import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import ProfessionalService from '../../services/ProfessionalService';

const MyServicesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadMyServices();
  }, []);

  const loadMyServices = async () => {
    try {
      setIsLoading(true);
      const allServices = await ProfessionalService.getServicesRequested();
      // Filtrar apenas os serviços solicitados pelo usuário atual
      const myServices = allServices.filter(service => service.clientId === user.id);
      setServices(myServices);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus serviços');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteService = (service) => {
    setSelectedService(service);
    setRatingModalVisible(true);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Erro', 'Por favor, selecione uma pontuação');
      return;
    }

    try {
      // Atualizar o status do serviço para concluído
      const updatedService = {
        ...selectedService,
        status: 'completed',
        completedDate: new Date().toISOString(),
        rating: rating,
        comment: comment
      };

      await ProfessionalService.updateServiceRequest(updatedService);

      // Adicionar avaliação ao profissional
      const ratingData = {
        clientId: user.id,
        clientName: user.name,
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
        serviceId: selectedService.id
      };

      await ProfessionalService.addProfessionalRating(selectedService.professionalId, ratingData);

      // Atualizar a lista local
      setServices(prev => prev.map(service => 
        service.id === selectedService.id ? updatedService : service
      ));

      setRatingModalVisible(false);
      setSelectedService(null);
      setRating(0);
      setComment('');

      Alert.alert('Sucesso!', 'Serviço marcado como concluído e avaliação enviada!');
    } catch (error) {
      console.error('Erro ao finalizar serviço:', error);
      Alert.alert('Erro', 'Não foi possível finalizar o serviço');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Aguardando';
      case 'accepted': return 'Aceito';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const renderStars = (currentRating, onPress = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPress && onPress(i)}
          disabled={!onPress}
        >
          <Text style={[
            styles.star,
            { color: i <= currentRating ? '#ffc107' : '#ddd' }
          ]}>
            ⭐
          </Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const ServiceCard = ({ service }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.professionalName}>{service.professionalName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(service.status) }]}>
          <Text style={styles.statusText}>{getStatusText(service.status)}</Text>
        </View>
      </View>

      <Text style={styles.serviceDescription} numberOfLines={2}>
        {service.serviceDescription}
      </Text>

      <View style={styles.serviceDetails}>
        <Text style={styles.serviceValue}>
          Valor: R$ {service.serviceValue.toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.serviceDate}>
          Solicitado em: {new Date(service.requestDate).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      {service.urgency && (
        <Text style={styles.urgencyText}>
          Urgência: {service.urgency === 'low' ? 'Baixa' : 
                    service.urgency === 'normal' ? 'Normal' :
                    service.urgency === 'high' ? 'Alta' : 'Urgente'}
        </Text>
      )}

      {service.additionalNotes && (
        <Text style={styles.notesText}>
          Observações: {service.additionalNotes}
        </Text>
      )}

      {service.status === 'completed' && service.rating && (
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Sua avaliação:</Text>
          {renderStars(service.rating)}
          {service.comment && (
            <Text style={styles.commentText}>"{service.comment}"</Text>
          )}
        </View>
      )}

      <View style={styles.serviceActions}>
        {service.status === 'accepted' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleCompleteService(service)}
          >
            <Text style={styles.completeButtonText}>Marcar como Concluído</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate('ProfessionalDetails', { 
            professionalId: service.professionalId 
          })}
        >
          <Text style={styles.detailsButtonText}>Ver Profissional</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRatingModal = () => (
    <Modal
      visible={ratingModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setRatingModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Avaliar Serviço</Text>
          <Text style={styles.modalSubtitle}>
            Como foi o serviço prestado por {selectedService?.professionalName}?
          </Text>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Pontuação:</Text>
            {renderStars(rating, setRating)}
          </View>

          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>Comentário (opcional):</Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Deixe um comentário sobre o serviço..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setRatingModalVisible(false);
                setRating(0);
                setComment('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitRatingButton}
              onPress={handleSubmitRating}
            >
              <Text style={styles.submitRatingButtonText}>Enviar Avaliação</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>Nenhum serviço solicitado</Text>
      <Text style={styles.emptyStateText}>
        Você ainda não solicitou nenhum serviço. Explore a lista de profissionais e encontre o que você precisa!
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explorar Profissionais</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando seus serviços...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Serviços</Text>
        <Text style={styles.subtitle}>
          Acompanhe os serviços que você solicitou
        </Text>
      </View>

      {services.length > 0 ? (
        <FlatList
          data={services}
          renderItem={({ item }) => <ServiceCard service={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      {renderRatingModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  professionalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  serviceDetails: {
    marginBottom: 8,
  },
  serviceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 2,
  },
  serviceDate: {
    fontSize: 12,
    color: '#666',
  },
  urgencyText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  ratingSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  star: {
    fontSize: 20,
    marginRight: 2,
  },
  commentText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 10,
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  commentSection: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitRatingButton: {
    flex: 1,
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitRatingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyServicesScreen;

