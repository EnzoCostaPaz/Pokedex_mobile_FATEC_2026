// src/components/card/index.android.tsx
import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { styles } from './styles';


export type CardProps = {
  number: string;
  name: string;
  type: 'normal' | 'fogo' | 'eletrico' | 'agua';
  pokemonImage: ImageSourcePropType;
  details: React.ReactNode[];
};

const bgColors = {
  normal: '#A8A77A',    
  fogo: '#EE8130',     
  eletrico: '#F7D02C',  
  agua: '#6390F0',   
};

export function Card({ number, name, type, pokemonImage, details }: CardProps) {
  return (
    <View style={[styles.container_android, { backgroundColor: bgColors[type] }]}>
        
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

      <View style={styles.detailsContainer_android}>
        {details.map((linha, index) => (
          <Text key={index} style={styles.detailText_android}>
            {linha}
          </Text>
        ))}
      </View>

    </View>
  );
}

