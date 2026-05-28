import React, { useRef, useState } from 'react';
import { View, Text, Image, ImageSourcePropType, Animated, Pressable } from 'react-native';
import { styles } from './styles';

export type CardProps = {
  number: string;
  name: string;
  type: 'normal' | 'fogo' | 'eletrico' | 'agua' | 'grama';
  pokemonImage: ImageSourcePropType;
  details: React.ReactNode[];
};

const bgColors = {
  normal: '#A8A77A',
  fogo: '#EE8130',
  eletrico: '#F7D02C',
  agua: '#6390F0',
  grama: '#7AC74C',
};

export function Card({ number, name, type, pokemonImage, details }: CardProps) {

  //valor inicial da animação
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

  //estilo de frente da carta

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  //estilo de tras da carta
  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <Pressable onPress={flipCard} style={styles.container_android}>
      <Animated.View style={[styles.cardFace_android, { backgroundColor: bgColors[type] }, frontAnimatedStyle]}>
        <Text style={styles.title_android}>
          {number} - {name}
        </Text>

        <View style={styles.imageContainer_android}>
          <Image
            source={pokemonImage}
            style={styles.pokemonImage_android}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* costa do card*/}
      <Animated.View style={[styles.cardFace_android, styles.cardBack_android, { backgroundColor: bgColors[type] }, backAnimatedStyle]}>
        <View style={styles.detailsContainer_android}>
          {details.map((linha, index) => (
            <Text key={index} style={styles.detailText_android}>
              {linha}
            </Text>
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
};