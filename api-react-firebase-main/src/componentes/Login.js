import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig'; // Ajusta el path si es diferente
//import { useNavigation } from '@react-navigation/native';}
import { useNavigation } from '@react-navigation/native';


export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Ingresar" onPress={handleLogin} />
      <View style={{ marginTop: 10 }}>
        <Button title="¿No tienes cuenta? Regístrate" onPress={() => navigation.navigate('Registro')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 30,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffe81f',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ffe81f',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#ffe81f',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: '#ffe81f',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
