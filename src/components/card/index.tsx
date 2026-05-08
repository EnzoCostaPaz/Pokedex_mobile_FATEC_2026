import { View, Text, Image, ImageSourcePropType, ImageBackground } from 'react-native';
import { styles } from './styles';
import FundoAgua from '@assets/images/fundo_agua.png';
import FundoFogo from '@assets/images/fundo_fogo.png';
import FundoNormal from '@assets/images/fundo_ar.png';
import FundoEletrico from '@assets/images/fundo_eletrico.png'; 
import React from 'react';

export type CardProps = {
  number: string;
  name: string;
  type: 'normal' | 'fogo' | 'eletrico' | 'agua';
  pokemonImage: ImageSourcePropType;
  details: React.ReactNode[]; 
};

const bgImages = {
  normal: FundoNormal,       
  fogo: FundoFogo,    
  eletrico: FundoEletrico, 
  agua: FundoAgua,    
};

export function Card({ number, name, type, pokemonImage, details }: CardProps) {
  return (
    <ImageBackground 
      source={bgImages[type]} 
      style={styles.container}
      imageStyle={{ borderRadius: 8 }}
      resizeMode='cover' 
      
    >
        
      <Text style={styles.title}>
        {number} - {name}
      </Text>

      <View style={styles.contentRow}>
        <Image 
            source={pokemonImage} 
            style={styles.pokemonImage} 
            resizeMode="contain" 
        />

        <View style={styles.detailsContainer}>
          {details.map((linha, index) => (
            <Text key={index} style={styles.detailText}>
              {linha}
            </Text>
          ))}
        </View>
      </View>

    </ImageBackground>
  );
}