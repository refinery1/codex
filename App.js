import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

function PlayScreen({ type, onBack }) {
  const soundFile = type === 'pebbles'
    ? require('./resources/sound/pebbles.wav')
    : require('./resources/sound/snow.wav');
  const imageFile = type === 'pebbles'
    ? require('./resources/image/pebble.png')
    : require('./resources/image/snow.png');

  const playSound = useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  }, [soundFile]);

  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 333);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 666);
    try {
      await playSound();
    } catch (e) {
      console.warn('Unable to play sound', e);
    }
  };

  return (
    <Pressable style={styles.container} onPressIn={handlePress}>
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
      <View style={styles.menuOptions}>
        <Pressable
          style={styles.menuImageWrapper}
          onPress={() => onSelect('pebbles')}
        >
          <Image
            source={require('./resources/image/pebble.png')}
            style={styles.menuImage}
          />
        </Pressable>
        <Pressable
          style={styles.menuImageWrapper}
          onPress={() => onSelect('snow')}
        >
          <Image
            source={require('./resources/image/snow.png')}
            style={styles.menuImage}
          />
        </Pressable>
      </View>
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
  menuOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  menuImageWrapper: {
    margin: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  menuImage: {
    width: 150,
    height: 150,
    borderRadius: 4,
  },
});
