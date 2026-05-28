import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  // ESTILOS WEB

  container: {
    width: 280,
    height: 400,
    margin: 16,
  },
  cardFace: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 8,
  },
  imageBg: {
    width: '100%',
    height: '100%',
    padding: 16,
  },
  cardBack: {
    // Apenas identificador, o flex faz o resto
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center', // Centraliza o título
  },
  contentCenter: {
    flex: 1,
    alignItems: 'center',      // Centraliza a imagem horizontalmente
    justifyContent: 'center',  // Centraliza a imagem verticalmente
  },
  pokemonImage: {
    width: 160,
    height: 160,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center', // Centraliza a "caixa" de textos verticalmente
    alignItems: 'center',     // Centraliza os textos no meio da carta
  },
  
  detailText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 6,
  },

  // android
  container_android: {
    flex: 1,
    maxWidth: '48%',
    height: 200,
    marginBottom: 16,
  },

  cardFace_android: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 8,
    padding:12,
  },
  cardBack_android: {
    justifyContent: 'center'
  },

  title_android: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 10,
  },

  imageContainer_android: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flex: 1
  },

  pokemonImage_android: {
    width: 100,
    height: 100,
  },

  detailsContainer_android: {
    paddingTop: 10,
    width: '100%',
  },

  detailText_android: {
    fontSize: 10,
    color: '#000',
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  }
});