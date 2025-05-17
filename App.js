import React, { useCallback } from 'react';
import { View, Image, StyleSheet, Pressable, Vibration } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const playSound = useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./resources/sound/pebbles.mp3')
    );
    await sound.playAsync();
  }, []);

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
      <Image source={require('./resources/image/pebble.png')} style={styles.image} />
    </Pressable>
  );
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
});
