import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigation = useNavigation();

  let ganados = 0;
  let perdidos = 0;

  const handleRegistro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      // 🔁 Guardar datos en Firestore con el mismo UID como ID del documento
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        ganados,
        perdidos
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate('Login'); // o a Home si prefieres
    } catch (error) {
      Alert.alert('Error al registrarse', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro</Text>

      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Correo" value={correo} onChangeText={setCorreo} style={styles.input} />
      <TextInput placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry style={styles.input} />
      <TextInput placeholder="Fecha de nacimiento" value={fecha} onChangeText={setFecha} style={styles.input} />
      <TextInput placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" style={styles.input} />

      <Button title="Registrarse" onPress={handleRegistro} />
      <View style={{ marginTop: 10 }}>
        <Button title="¿Ya tienes cuenta? Inicia sesión" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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