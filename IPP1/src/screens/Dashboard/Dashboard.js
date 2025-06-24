import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import instance from '../../service/axiosOrder'; // Make sure this is compatible with React Native
import Products from '../Products/Products';

const Tab = createBottomTabNavigator();

function ProductsScreen() {
  return <Products />;
}

function OrdersScreen() {
  // ...implement your Orders screen here
  return <View style={styles.center}><Text>Orders</Text></View>;
}

function CartScreen() {
  // ...implement your Cart screen here
  return <View style={styles.center}><Text>Cart</Text></View>;
}

function ProfileScreen({ userDetails, onLogout }) {
  return (
    <View style={styles.center}>
      <Image
        source={
          userDetails?.avatar
            ? { uri: userDetails.avatar }
            : { uri: 'https://ui-avatars.com/api/?name=User' }
        }
        style={styles.avatar}
      />
      <Text style={styles.name}>{userDetails?.name}</Text>
      <Text style={styles.email}>{userDetails?.email}</Text>
      <Text style={styles.role}>Role: {userDetails?.role}</Text>
      <Button title="Log Out" color="red" onPress={onLogout} />
    </View>
  );
}

export default function Dashboard({ setLogin }) {
  const [userDetails, setUserDetails] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await instance.get('/user/auth');
        setUserDetails(response.data);
      } catch (error) {
        // handle error
      }
    };
    fetchUserDetails();

    setTimeout(() => setShowWelcome(false), 2000);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await instance.get('/products/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const products = response.data || [];
        const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out", style: "destructive", onPress: async () => {
            await AsyncStorage.removeItem('token');
            setLogin(false);
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  if (showWelcome) {
    return (
      <View style={styles.welcomeScreen}>
        <Text style={styles.welcomeText}>Welcome to the E-com Platform!</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Products') iconName = 'view-list';
          else if (route.name === 'Orders') iconName = 'clipboard-list';
          else if (route.name === 'Cart') iconName = 'cart';
          else if (route.name === 'Profile') iconName = 'account';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffe066',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile">
        {() => <ProfileScreen userDetails={userDetails} onLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  avatar: { width: 80, height: 80, borderRadius: 40, margin: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16, marginBottom: 4 },
  role: { fontSize: 16, marginBottom: 16 },
  welcomeScreen: {
    flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center'
  },
  welcomeText: {
    color: '#fff', fontSize: 28, fontWeight: 'bold', fontFamily: 'Courgette'
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  productStock: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    margin: 16,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  productImageLarge: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  productCategory: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    marginBottom: 16,
  },
  reviewsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  reviewBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewRating: {
    fontSize: 14,
    color: '#888',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  noReviews: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  }
});