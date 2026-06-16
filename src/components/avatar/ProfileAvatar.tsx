import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

interface ProfileAvatarProps {
  name: string;
  imageSource?: ImageSourcePropType;
}

export function ProfileAvatar({ name, imageSource }: ProfileAvatarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>FOTO</Text>
          </View>
        )}
      </View>
      <Text style={styles.trainerName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // Retiramos o width daqui para a tela principal controlar o posicionamento
  },
  avatarWrapper: {
    width: 220, 
    height: 220, 
    borderRadius: 110,
    backgroundColor: '#333333',
    borderWidth: 3,
    borderColor: '#555555',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 20,
  },
  trainerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
});