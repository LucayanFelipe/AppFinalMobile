import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Linking
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import ProfessionalService from '../../services/ProfessionalService';
import ImageService from '../../services/ImageService';
import PortfolioManager from '../../components/common/PortfolioManager';

const ProfessionalDetailsScreen = ({ route, navigation }) => {
  const { professionalId } = route.params;
  const { user } = useAuth();
  const [professional, setProfessional] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfessionalDetails();
  }, [professionalId]);

  const loadProfessionalDetails = async () => {
    try {
      setIsLoading(true);
      const professionalData = await ProfessionalService.getProfessionalById(professionalId);
      if (professionalData) {
        setProfessional(professionalData);
        
        // Carregar foto de perfil
        const imageUri = await ImageService.getProfileImage(professionalId);
        setProfileImage(imageUri);
        
        // Carregar avaliações
        const ratingsData = await ProfessionalService.getProfessionalRatings(professionalId);
        setRatings(ratingsData);
      } else {
        Alert.alert('Erro', 'Profissional não encontrado');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do profissional:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do profissional');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.join('');
  };

  const handleWhatsAppContact = () => {
    if (!professional?.phone) {
      Alert.alert('Erro', 'Número de telefone não disponível');
      return;
    }

    const phoneNumber = professional.phone.replace(/\D/g, '');
    const message = `Olá ${professional.name}, vi seu perfil no app Profissionais Locais e gostaria de saber mais sobre seus serviços.`;
    const whatsappUrl = `whatsapp://send?phone=55${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert('Erro', 'WhatsApp não está instalado no dispositivo');
        }
      })
      .catch((err) => {
        console.error('Erro ao abrir WhatsApp:', err);
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
      });
  };

  const handleRequestService = () => {
    navigation.navigate('RequestService', { professionalId: professional.id });
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileImageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.defaultProfileImage}>
            <Text style={styles.defaultProfileImageText}>
              {professional?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={styles.professionalName}>{professional?.name}</Text>
        <Text style={styles.professionalCategory}>{professional?.category}</Text>
        <Text style={styles.professionalLocation}>
          {professional?.address?.city}, {professional?.address?.state}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.stars}>{renderStars(professional?.averageRating || 0)}</Text>
          <Text style={styles.ratingText}>
            {(professional?.averageRating || 0).toFixed(1)} ({professional?.totalReviews || 0} avaliações)
          </Text>
        </View>
      </View>
    </View>
  );

  const renderContactButtons = () => (
    <View style={styles.contactButtons}>
      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppContact}>
        <Text style={styles.buttonIcon}>📱</Text>
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.requestButton} onPress={handleRequestService}>
        <Text style={styles.buttonIcon}>🔧</Text>
        <Text style={styles.buttonText}>Solicitar Serviço</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfessionalInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sobre o Profissional</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Experiência:</Text>
        <Text style={styles.infoValue}>
          {professional?.experience || 'Não informado'}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Telefone:</Text>
        <Text style={styles.infoValue}>
          {professional?.phone || 'Não informado'}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>
          {professional?.email || 'Não informado'}
        </Text>
      </View>
    </View>
  );

  const renderServices = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Serviços Oferecidos</Text>
      <Text style={styles.servicesDescription}>
        {professional?.description || 'Nenhuma descrição disponível'}
      </Text>
    </View>
  );

  const renderAddress = () => {
    if (!professional?.address) return null;

    const { address } = professional;
    const fullAddress = `${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ''}, ${address.neighborhood}, ${address.city}/${address.state}, CEP: ${address.zipCode}`;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Local de Atendimento</Text>
        <Text style={styles.addressText}>{fullAddress}</Text>
      </View>
    );
  };

  const renderReviews = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Avaliações ({ratings.length})</Text>
      
      {ratings.length > 0 ? (
        ratings.map((rating, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{rating.clientName}</Text>
              <Text style={styles.reviewStars}>{renderStars(rating.rating)}</Text>
            </View>
            {rating.comment && (
              <Text style={styles.reviewComment}>{rating.comment}</Text>
            )}
            <Text style={styles.reviewDate}>
              {new Date(rating.date).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noReviewsText}>
          Este profissional ainda não possui avaliações.
        </Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!professional) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profissional não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderProfileHeader()}
      {renderContactButtons()}
      {renderProfessionalInfo()}
      {renderServices()}
      {renderAddress()}
      
      <View style={styles.section}>
        <PortfolioManager userId={professional.id} editable={false} />
      </View>
      
      {renderReviews()}
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  defaultProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfileImageText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  professionalCategory: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 5,
  },
  professionalLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    fontSize: 16,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  contactButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
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
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  servicesDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewStars: {
    fontSize: 14,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ProfessionalDetailsScreen;

