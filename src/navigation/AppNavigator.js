import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Importar telas
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import RegisterClientScreen from '../screens/Auth/RegisterClientScreen';
import RegisterProfessionalScreen from '../screens/Auth/RegisterProfessionalScreen';
import BecomeProfessionalScreen from '../screens/Auth/BecomeProfessionalScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import ProfessionalDetailsScreen from '../screens/Professional/ProfessionalDetailsScreen';
import RequestServiceScreen from '../screens/Services/RequestServiceScreen';
import MyServicesScreen from '../screens/Services/MyServicesScreen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007bff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Entrar' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Criar Conta' }}
      />
      <Stack.Screen 
        name="RegisterClient" 
        component={RegisterClientScreen}
        options={{ title: 'Cadastro de Cliente' }}
      />
      <Stack.Screen 
        name="RegisterProfessional" 
        component={RegisterProfessionalScreen}
        options={{ title: 'Cadastro de Profissional' }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007bff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Profissionais Locais',
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('MyServices')}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#fff', fontSize: 24 }}>📋</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={{ color: '#fff', fontSize: 24 }}>👤</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Meu Perfil' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen 
        name="BecomeProfessional" 
        component={BecomeProfessionalScreen}
        options={{ title: 'Tornar-se Profissional' }}
      />
      <Stack.Screen 
        name="ProfessionalDetails" 
        component={ProfessionalDetailsScreen}
        options={{ title: 'Detalhes do Profissional' }}
      />
      <Stack.Screen 
        name="RequestService" 
        component={RequestServiceScreen}
        options={{ title: 'Solicitar Serviço' }}
      />
      <Stack.Screen 
        name="MyServices" 
        component={MyServicesScreen}
        options={{ title: 'Meus Serviços' }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Você pode retornar uma tela de loading aqui
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default AppNavigator;

