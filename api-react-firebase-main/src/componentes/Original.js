import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator
} from 'react-native';

const MAX_ATTEMPTS = 5;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-:\' '.split('');

export default function JuegoPersonajes() {
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState({});
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRandomCharacter();
  }, []);

  const getRandomCharacter = async () => {
    setLoading(true);
    try {
      const id = Math.floor(Math.random() * 82) + 1;
      const res = await fetch(`https://swapi.py4e.com/api/people/${id}`);
      const data = await res.json();

      if (!data.name) return getRandomCharacter(); // inválido, intenta otro

      let homeworldName = '';
      try {
        const homeworldRes = await fetch(data.homeworld);
        const homeworldData = await homeworldRes.json();
        homeworldName = homeworldData.name;
      } catch (e) {
        homeworldName = 'Desconocido';
      }

      setCharacterName(data.name.toUpperCase());
      setCharacterInfo({
        gender: data.gender,
        height: data.height,
        birthYear: data.birth_year,
        eyeColor: data.eye_color,
        homeworld: homeworldName,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener personaje:', error);
      setLoading(false);
    }
  };

  const handleLetterClick = (letter) => {
    if (guessedLetters.includes(letter) || gameOver || gameWon) return;

    const updatedGuessed = [...guessedLetters, letter];
    setGuessedLetters(updatedGuessed);

    if (!characterName.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= MAX_ATTEMPTS) {
        setGameOver(true);
      }
    } else {
      const allCorrect = characterName
        .split('')
        .every((l) => updatedGuessed.includes(l) || l === ' ');
      if (allCorrect) {
        setGameWon(true);
      }
    }
  };

  const renderWord = () =>
    characterName.split('').map((letter, index) => (
      <Text key={index} style={styles.letter}>
        {guessedLetters.includes(letter) || gameOver || gameWon || letter === ' ' ? letter : '_'}
      </Text>
    ));

  const restartGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setGameWon(false);
    setCharacterName('');
    setCharacterInfo({});
    getRandomCharacter();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adivina el Personaje de Star Wars</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={styles.hintTitle}>🔍 Pistas:</Text>
          <Text>👁 Color de ojos: {characterInfo.eyeColor}</Text>
          <Text>🚻 Género: {characterInfo.gender}</Text>
          <Text>📏 Altura: {characterInfo.height} cm</Text>
          <Text>🎂 Año de nacimiento: {characterInfo.birthYear}</Text>
          <Text>🌍 Planeta natal: {characterInfo.homeworld}</Text>

          <View style={styles.wordContainer}>{renderWord()}</View>

          <View style={styles.keyboard}>
            {ALPHABET.map((letter) => (
              <TouchableOpacity
                key={letter}
                onPress={() => handleLetterClick(letter)}
                disabled={guessedLetters.includes(letter) || gameOver || gameWon}
                style={[
                  styles.key,
                  guessedLetters.includes(letter) && styles.keyDisabled,
                ]}
              >
                <Text>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.attempts}>
            Fallos: {wrongGuesses} / {MAX_ATTEMPTS}
          </Text>

          {gameOver && (
            <Text style={styles.lost}>💀 ¡Perdiste! Era: {characterName}</Text>
          )}
          {gameWon && <Text style={styles.won}>🎉 ¡Ganaste!</Text>}

          {(gameOver || gameWon) && (
            <TouchableOpacity style={styles.button} onPress={restartGame}>
              <Text style={styles.buttonText}>Jugar otra vez</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
  hintTitle: { fontWeight: 'bold', fontSize: 18, marginVertical: 10 },
  wordContainer: { flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' },
  letter: { fontSize: 28, marginHorizontal: 4 },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  key: {
    backgroundColor: '#eee',
    padding: 10,
    margin: 4,
    borderRadius: 4,
    width: 40,
    alignItems: 'center',
  },
  keyDisabled: { backgroundColor: '#ccc' },
  attempts: { fontSize: 16, marginBottom: 10 },
  lost: { color: 'red', fontSize: 18 },
  won: { color: 'green', fontSize: 18 },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#0066cc',
    borderRadius: 5,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
