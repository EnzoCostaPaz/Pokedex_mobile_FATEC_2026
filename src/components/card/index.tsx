// src/components/card/index.tsx
import React, { useRef, useState } from 'react';
import { View, Text, Image, ImageSourcePropType, ImageBackground, Animated, Pressable } from 'react-native';
import { styles } from './styles';

import FundoAgua from '@assets/images/banners/fundo_agua.png';
import FundoAr from '@assets/images/banners/fundo_ar.png';
import FundoDragao from '@assets/images/banners/fundo_dragao.png';
import FundoEletrico from '@assets/images/banners/fundo_eletrico.png';
import FundoFada from '@assets/images/banners/fundo_fada.png';
import FundoFanstasma from '@assets/images/banners/fundo_fantasma.png';
import FundoFogo from '@assets/images/banners/fundo_fogo.png';
import FundoGelo from '@assets/images/banners/fundo_gelo.png';
import FundoGrama from '@assets/images/banners/fundo_grama.png';
import FundoLutador from'@assets/images/banners/fundo_lutador.png';
import FundoMetal from '@assets/images/banners/fundo_metal.png';
import FundoPedra from '@assets/images/banners/fundo_pedra.png';
import FundoPsicico from '@assets/images/banners/fundo_psicico.png';
import FundoRocha from '@assets/images/banners/fundo_rocha.png';
import FundoVeneno from '@assets/images/banners/FundoVeneno.png';
import FundoInseto from '@assets/images/banners/fundo_inseto.png';
import FundoVoador from '@assets/images/banners/fundo_voador.png';

export type CardProps = {
  number: string;
  name: string;
  type: 'normal' |
         'fogo'  | 
         'eletrico' | 
         'agua' | 
         'grama'| 
         'fada' | 
         'fantasma' | 
         'metal' | 
         'gelo' | 
         'lutador' | 
         'psicico' | 
         'veneno' | 
         'voador'| 
         'dragao' | 
         'pedra' | 
         'inseto' |
         'rocha';

  pokemonImage: ImageSourcePropType;
  details: React.ReactNode[];
};

const bgImages = {
  normal: FundoAr,
  fogo: FundoFogo,
  eletrico: FundoEletrico,
  agua: FundoAgua,
  grama: FundoGrama,
  fada: FundoFada,
  fantasma: FundoFanstasma,
  metal: FundoMetal,
  gelo: FundoGelo,
  lutador: FundoLutador,
  psicico: FundoPsicico,
  veneno: FundoVeneno,
  voador: FundoVoador,
  dragao: FundoDragao,
  pedra: FundoPedra,
  inseto: FundoInseto,
  rocha: FundoRocha
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