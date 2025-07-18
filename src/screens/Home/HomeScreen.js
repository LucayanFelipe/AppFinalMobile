import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import ProfessionalService from '../../services/ProfessionalService';
import ImageService from '../../services/ImageService';
import CustomPicker from '../../components/common/CustomPicker';
import { PROFESSIONAL_CATEGORIES } from '../../utils/locations';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [professionals, searchText, selectedCategory, selectedRating]);

  const loadProfessionals = async () => {
    try {
      setIsLoading(true);
      const professionalsData = await ProfessionalService.getProfessionals();
      setProfessionals(professionalsData);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de profissionais');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...professionals];

    // Filtro por texto (nome ou categoria)
    if (searchText) {
      filtered = filtered.filter(prof => 
        prof.name.toLowerCase().includes(searchText.toLowerCase()) ||
        prof.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(prof => prof.category === selectedCategory);
    }

    // Filtro por pontuação
    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(prof => prof.averageRating >= minRating);
    }

    setFilteredProfessionals(filtered);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory('');
    setSelectedRating('');
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

  const ProfessionalCard = ({ professional }) => {
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
      loadProfileImage();
    }, [professional.id]);

    const loadProfileImage = async () => {
      const imageUri = await ImageService.getProfileImage(professional.id);
      setProfileImage(imageUri);
    };

    return (
      <TouchableOpacity
        style={styles.professionalCard}
        onPress={() => navigation.navigate('ProfessionalDetails', { professionalId: professional.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Text style={styles.defaultProfileImageText}>
                  {professional.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.professionalInfo}>
            <Text style={styles.professionalName}>{professional.name}</Text>
            <Text style={styles.professionalCategory}>{professional.category}</Text>
            <Text style={styles.professionalLocation}>
              {professional.address?.city}, {professional.address?.state}
            </Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.stars}>{renderStars(professional.averageRating)}</Text>
              <Text style={styles.ratingText}>
                {professional.averageRating.toFixed(1)} ({professional.totalReviews} avaliações)
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.professionalDescription} numberOfLines={2}>
          {professional.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.experienceText}>
            {professional.experience || 'Experiência não informada'}
          </Text>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsButtonText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nome ou categoria..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filtersRow}>
        <View style={styles.filterItem}>
          <CustomPicker
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            items={[
              { value: '', label: 'Todas as categorias' },
              ...PROFESSIONAL_CATEGORIES.map(cat => ({ value: cat, label: cat }))
            ]}
            placeholder="Categoria"
          />
        </View>

        <View style={styles.filterItem}>
          <CustomPicker
            selectedValue={selectedRating}
            onValueChange={setSelectedRating}
            items={[
              { value: '', label: 'Todas as pontuações' },
              { value: '4', label: '4+ estrelas' },
              { value: '3', label: '3+ estrelas' },
              { value: '2', label: '2+ estrelas' },
              { value: '1', label: '1+ estrelas' }
            ]}
            placeholder="Pontuação"
          />
        </View>
      </View>

      {(searchText || selectedCategory || selectedRating) && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>Nenhum profissional encontrado</Text>
      <Text style={styles.emptyStateText}>
        {searchText || selectedCategory || selectedRating
          ? 'Tente ajustar os filtros de busca'
          : 'Ainda não há profissionais cadastrados'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋
        </Text>
        <Text style={styles.headerSubtitle}>
          {user?.userType === 'professional' 
            ? 'Veja outros profissionais da plataforma' 
            : 'Encontre o profissional ideal para você'}
        </Text>
      </View>

      {renderFilters()}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando profissionais...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProfessionals}
          renderItem={({ item }) => <ProfessionalCard professional={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterItem: {
    flex: 1,
  },
  clearFiltersButton: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#dc3545',
    borderRadius: 20,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  professionalCard: {
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
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  defaultProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfileImageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  professionalCategory: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 2,
  },
  professionalLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    fontSize: 12,
    marginRight: 5,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  professionalDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  viewDetailsButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;

