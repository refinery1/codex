import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Vibration,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';

const SCREEN_HEIGHT = Dimensions.get('window').height;

function PlayScreen({ type, onBack }) {
  const soundFile =
    type === 'pebbles'
      ? require('./resources/sound/pebbles.wav')
      : require('./resources/sound/snow.wav');
  const imageFile =
    type === 'pebbles'
      ? require('./resources/image/pebble.png')
      : require('./resources/image/snow.png');

  const playSound = useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  }, [soundFile]);

  const translateY = useRef(new Animated.Value(0)).current;

  const handlePressIn = async () => {
    Vibration.vibrate(1000);
    try {
      await playSound();
    } catch (e) {
      console.warn('Unable to play sound', e);
    }
  };

  const finishGesture = (shouldClose) => {
    if (shouldClose) {
      Animated.timing(translateY, {
        toValue: -SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        translateY.setValue(0);
        onBack();
      });
    } else {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handlePressIn,
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(Math.min(0, gestureState.dy));
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose = gestureState.vy < 0 || gestureState.dy < -50;
        finishGesture(shouldClose);
      },
      onPanResponderTerminate: (_, gestureState) => {
        const shouldClose = gestureState.vy < 0 || gestureState.dy < -50;
        finishGesture(shouldClose);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.container, StyleSheet.absoluteFill, { transform: [{ translateY }] }]}
      {...responder.panHandlers}
    >
      <Image source={imageFile} style={styles.image} />
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </Animated.View>
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

  return (
    <View style={{ flex: 1 }}>
      <Menu onSelect={setSelection} />
      {selection && (
        <PlayScreen type={selection} onBack={() => setSelection(null)} />
      )}
    </View>
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
