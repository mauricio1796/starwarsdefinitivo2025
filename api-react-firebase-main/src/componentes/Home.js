import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';

const fetchAllPaginated = async (baseUrl) => {
  let results = [];
  let url = baseUrl;

  while (url) {
    const res = await fetch(url);
    const json = await res.json();
    results = [...results, ...json.results];
    url = json.next;
  }

  return results;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    starships: [],
    people: [],
    planets: [],
    vehicles: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [starships, people, planets, vehicles] = await Promise.all([
          fetchAllPaginated('https://swapi.py4e.com/api/starships/'),
          fetchAllPaginated('https://swapi.py4e.com/api/people/'),
          fetchAllPaginated('https://swapi.py4e.com/api/planets/'),
          fetchAllPaginated('https://swapi.py4e.com/api/vehicles/'),
        ]);

        setData({ starships, people, planets, vehicles });
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffe81f" />
        <Text style={{ color: '#ffe81f', marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <Section title="Naves" items={data.starships} renderItem={(item) => (
        <>
          <Text style={styles.nombre}>{item.name}</Text>
          <Text style={styles.info}>Modelo: {item.model}</Text>
        </>
      )} />

      <Section title="Personajes" items={data.people} renderItem={(item) => (
        <>
          <Text style={styles.nombre}>{item.name}</Text>
          <Text style={styles.info}>Altura: {item.height}</Text>
        </>
      )} />

      <Section title="Planetas" items={data.planets} renderItem={(item) => (
        <>
          <Text style={styles.nombre}>{item.name}</Text>
          <Text style={styles.info}>Clima: {item.climate}</Text>
        </>
      )} />

      <Section title="Vehículos" items={data.vehicles} renderItem={(item) => (
        <>
          <Text style={styles.nombre}>{item.name}</Text>
          <Text style={styles.info}>Modelo: {item.model}</Text>
        </>
      )} />
    </ScrollView>
  );
}

const Section = ({ title, items, renderItem }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.lista}>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          {renderItem(item)}
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#000' },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
    backgroundColor: '#000',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffe81f',
    marginVertical: 10,
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    backgroundColor: '#1a1a1a',
    width: '48%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#ffe81f',
    borderWidth: 1,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffe81f',
    marginBottom: 4,
  },
  info: {
    color: '#ccc',
    fontSize: 14,
  },
});
