import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Vibration } from 'react-native';
import { Audio } from 'expo-av';

function PlayScreen({ type, onBack }) {
  const soundFile = type === 'pebbles'
    ? require('./resources/sound/pebbles.mp3')
    : require('./resources/sound/snow.mp3');
  const imageFile = type === 'pebbles'
    ? require('./resources/image/pebble.png')
    : require('./resources/image/snow.png');

  const playSound = useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  }, [soundFile]);

  const handlePress = async () => {
    Vibration.vibrate(100);
    try {
      await playSound();
    } catch (e) {
      console.warn('Unable to play sound', e);
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image source={imageFile} style={styles.image} />
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </Pressable>
  );
}

function Menu({ onSelect }) {
  return (
    <View style={styles.menuContainer}>
      <Pressable style={styles.menuOption} onPress={() => onSelect('pebbles')}>
        <Text style={styles.menuText}>Pebbles</Text>
      </Pressable>
      <Pressable style={styles.menuOption} onPress={() => onSelect('snow')}>
        <Text style={styles.menuText}>Snow</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [selection, setSelection] = useState(null);

  if (!selection) {
    return <Menu onSelect={setSelection} />;
  }

  return <PlayScreen type={selection} onBack={() => setSelection(null)} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
  },
  backText: {
    color: '#fff',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOption: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
    width: 200,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
  },
});
