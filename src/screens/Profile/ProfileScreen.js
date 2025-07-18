import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import ImageService from '../../services/ImageService';
import PortfolioManager from '../../components/common/PortfolioManager';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    loadProfileImage();
  }, [user]);

  const loadProfileImage = async () => {
    if (user?.id) {
      const imageUri = await ImageService.getProfileImage(user.id);
      setProfileImage(imageUri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleBecomeProfessional = () => {
    Alert.alert(
      'Tornar-se Profissional',
      'Você será redirecionado para completar seu cadastro profissional. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Continuar', 
          onPress: () => navigation.navigate('BecomeProfessional')
        }
      ]
    );
  };

  const renderProfileImage = () => (
    <View style={styles.profileImageContainer}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      ) : (
        <View style={styles.defaultProfileImage}>
          <Text style={styles.defaultProfileImageText}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderUserInfo = () => (
    <View style={styles.userInfo}>
      <Text style={styles.userName}>{user?.name}</Text>
      <Text style={styles.userEmail}>{user?.email}</Text>
      <View style={styles.userTypeBadge}>
        <Text style={styles.userTypeText}>
          {user?.userType === 'professional' ? '🔧 Profissional' : '👤 Cliente'}
        </Text>
      </View>
    </View>
  );

  const renderPersonalData = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dados Pessoais</Text>
      
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Nome:</Text>
        <Text style={styles.dataValue}>{user?.name}</Text>
      </View>
      
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Email:</Text>
        <Text style={styles.dataValue}>{user?.email}</Text>
      </View>
      
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Telefone:</Text>
        <Text style={styles.dataValue}>{user?.phone || 'Não informado'}</Text>
      </View>
    </View>
  );

  const renderProfessionalData = () => {
    if (user?.userType !== 'professional') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados Profissionais</Text>
        
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Categoria:</Text>
          <Text style={styles.dataValue}>{user?.category || 'Não informado'}</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Experiência:</Text>
          <Text style={styles.dataValue}>{user?.experience || 'Não informado'}</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Descrição:</Text>
          <Text style={styles.dataValue}>{user?.description || 'Não informado'}</Text>
        </View>
      </View>
    );
  };

  const renderAddress = () => {
    if (user?.userType !== 'professional' || !user?.address) return null;

    const { address } = user;
    const fullAddress = `${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ''}, ${address.neighborhood}, ${address.city}/${address.state}, CEP: ${address.zipCode}`;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Endereço</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataValue}>{fullAddress}</Text>
        </View>
      </View>
    );
  };

  const renderActions = () => (
    <View style={styles.actionsSection}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
      </TouchableOpacity>

      {user?.userType === 'client' && (
        <TouchableOpacity
          style={styles.becomeProfessionalButton}
          onPress={handleBecomeProfessional}
        >
          <Text style={styles.becomeProfessionalButtonText}>
            🔧 Tornar-se Profissional
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>🚪 Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {renderProfileImage()}
        {renderUserInfo()}
      </View>

      {renderPersonalData()}
      {renderProfessionalData()}
      {renderAddress()}

      {user?.userType === 'professional' && (
        <View style={styles.section}>
          <PortfolioManager userId={user.id} editable={true} />
        </View>
      )}

      {renderActions()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0056b3',
  },
  defaultProfileImageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  userTypeBadge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
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
  dataRow: {
    marginBottom: 10,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  actionsSection: {
    padding: 20,
    paddingBottom: 40,
  },
  editButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  becomeProfessionalButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  becomeProfessionalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;

