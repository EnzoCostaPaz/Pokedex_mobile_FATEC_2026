// src/components/card/index.tsx
import React, { useRef, useState } from 'react';
import { View, Text, Image, ImageSourcePropType, ImageBackground, Animated, Pressable } from 'react-native';
import { styles } from './styles';

import FundoAgua from '@assets/images/fundo_agua.png';
import FundoFogo from '@assets/images/fundo_fogo.png';
import FundoNormal from '@assets/images/fundo_ar.png';
import FundoEletrico from '@assets/images/fundo_eletrico.png';

export type CardProps = {
  number: string;
  name: string;
  type: 'normal' | 'fogo' | 'eletrico' | 'agua' | 'grama';
  pokemonImage: ImageSourcePropType;
  details: React.ReactNode[];
};

const bgImages = {
  normal: FundoNormal,
  fogo: FundoFogo,
  eletrico: FundoEletrico,
  agua: FundoAgua,
  grama: FundoNormal,
};

export function Card({ number, name, type, pokemonImage, details }: CardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    setIsFlipped(!isFlipped);
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg']
        })
      }]
  };
  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg']
        })
      }]
  };

  return (
    <Pressable onPress={flipCard} style={styles.container}>

      <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
        <ImageBackground
          source={bgImages[type]}
          style={styles.imageBg}
          imageStyle={{ borderRadius: 8 }}
          resizeMode="cover"
        >
          <Text style={styles.title}>
            {number} - {name}
          </Text>

          {/* View centralizadora da imagem */}
          <View style={styles.contentCenter}>
            <Image
              source={pokemonImage}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>
      </Animated.View>

      {/* --- COSTAS DA CARTA (STATUS) --- */}
      <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
        <ImageBackground
          source={bgImages[type]}
          style={styles.imageBg}
          imageStyle={{ borderRadius: 8 }}
          resizeMode="cover"
        >
          <View style={styles.detailsContainer}>
            {details.map((linha, index) => (
              <Text key={index} style={styles.detailText}>
                {linha}
              </Text>
            ))}
          </View>
        </ImageBackground>
      </Animated.View>

    </Pressable>
  );
}