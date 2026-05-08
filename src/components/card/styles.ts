import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 570,
    height: 220,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden', 
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12, 
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokemonImage: {
    left: 25,
    width: 120,
    height: 120,
  },
  detailsContainer: {
    flex: 1, 
    marginLeft: 16,
  },
  detailText: {
    left:65,
    width: 320,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'justify',
  },


  container_android: {
    width: '100%',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    elevation: 4, 
  },
  title_android: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'left', 
  },
  imageContainer_android: {
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 20,
  },
  pokemonImage_android: {
    width: 120, 
    height: 120,
  },
  detailsContainer_android: {
    width: '100%',
  },
  detailText_android: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'justify', 
  }
});