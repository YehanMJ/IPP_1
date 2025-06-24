import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../../service/axiosOrder';

export default function Login({ setLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const res = await instance.post('/user/login', {
        email: username,
        password: password,
      });

      const { accessToken, userID, userRole } = res.data;

      if (accessToken) {
        await AsyncStorage.setItem('token', accessToken); // Save token
        setLogin(true);
        navigation.navigate('Dashboard'); // Adjust to your actual screen name
      } else {
        Alert.alert('Login failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg7.jpeg')}
      style={styles.background}
      imageStyle={{ opacity: 0.4 }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Login</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#333"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            placeholderTextColor="#333"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxRow}>
          <Checkbox
            status={rememberMe ? 'checked' : 'unchecked'}
            onPress={() => setRememberMe(!rememberMe)}
            color="#000"
          />
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </View>

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.loginButton}
          labelStyle={{ color: '#fff' }}
        >
          Login
        </Button>

        <Text style={styles.registerText}>
          Don’t have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          >
            Register Here
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Courgette-Regular',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#000',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 6,
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
    color: '#000',
  },
  link: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
