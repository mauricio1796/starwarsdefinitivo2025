import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { auth } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      try {
        const docRef = doc(db, 'usuarios', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || '');
          setFecha(data.fecha || '');
          setTelefono(data.telefono || '');
        } else {
          Alert.alert('Usuario no encontrado');
        }
      } catch (error) {
        Alert.alert('Error al cargar datos', error.message);
      } finally {
        setCargando(false);
      }
    };
    traerDatos();
  }, [uid]);

  const actualizarDatos = async () => {
    try {
      const docRef = doc(db, 'usuarios', uid);
      await updateDoc(docRef, { nombre, fecha, telefono });
      Alert.alert('Datos actualizados con éxito');
    } catch (error) {
      Alert.alert('Error al actualizar', error.message);
    }
  };

  if (cargando) {
    return (
      <View style={[styles.contenedor, styles.cargandoContainer]}>
        <ActivityIndicator size="large" color="#ffe81f" />
        <Text style={{ color: '#ffe81f', marginTop: 10 }}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Perfil del Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#999"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        placeholderTextColor="#999"
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#999"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <View style={styles.botonContainer}>
        <Button
          title="Guardar cambios"
          onPress={actualizarDatos}
          color="#ffe81f"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Fondo oscuro tipo Star Wars
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffe81f', // Amarillo Star Wars
    textAlign: 'center',
    fontFamily: 'Courier New', // Tipografía tipo consola futurista
  },
  input: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#555',
    color: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  botonContainer: {
    marginTop: 10,
  },
  cargandoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
