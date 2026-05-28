    import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

    import { useState, useEffect } from 'react';
    import { Button } from '@/components/button';
    import { useAuth } from '@/context/AuthContext';
    import React from 'react';
    import { Card } from '@/components/card';

    // Importando o serviço da API e a tipagem
    import { getPokemon } from '@/services/api';
    import { pokemon } from '@/@types/pokemon';

    export default function DashboardAndroid() {
        const { signOut } = useAuth();
        // Estados para controlar a lista de pokemons e o carregamento da tela
        const [pokemonList, setPokemonList] = useState<pokemon[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        // use effect para todos os 151 pokemons

        useEffect(() => {
            async function loadPokemons() {
                try {
                    const data = await getPokemon(151); // Busca os 151 da primeira geração
                    setPokemonList(data);
                } catch (error) {
                    console.error("Erro ao carregar lista de pokemons:", error);
                } finally {
                    setIsLoading(false);
                }
            }
            loadPokemons();
        }, []);
        // tela de loding
        if (isLoading) {

            return (

                <View style={[styles.background, styles.center]}>
                    <ActivityIndicator size="large" color="#E3350D" />
                    <Text style={styles.loadingText}>Carregando Pokédex...</Text>
                </View>
            );
        }
        // Função que dita como cada Card deve ser renderizado dentro da lista
        const renderPokemonCard = ({ item }: { item: pokemon }) => {
            // Mapeia os poderes da API para o formato de nós do React com negrito
            const pokemonStats = item.poderes.map((p, index) => (
                <Text key={index}>
                    <Text style={{ fontWeight: 'bold' }}>{p.nome.toUpperCase()}:</Text> {p.forcaPoke}
                </Text>
            ));

            // mapeador de segurança para os tipos vindos da PokeAPI

            const typeMap: Record<string, 'normal' | 'fogo' | 'eletrico' | 'agua' | 'grama'> = {
                normal: 'normal',
                fire: 'fogo',
                water: 'agua',
                electric: 'eletrico',
                grass: 'grama'
            };
            // Pega o primeiro tipo do pokemon (item.tipo[0]) e traduz, se não achar, usa 'normal'
            const primaryType = typeMap[item.tipo[0]] || 'normal';
            return (
                <Card
                    number={item.index}
                    name={item.nome.charAt(0).toUpperCase() + item.nome.slice(1)}
                    type={primaryType}
                    pokemonImage={{ uri: item.imgPoke }}
                    details={pokemonStats}
                />
            );
        };

        return (
            <View style={styles.background}>
                <View style={styles.header}>
                    <Text style={styles.text}>Sua Pokédex</Text>
                </View>

                <FlatList
                    data={pokemonList}
                    keyExtractor={(item) => item.index} // index 001 como chave única
                    renderItem={renderPokemonCard}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                    }}
                    contentContainerStyle={[styles.scrollContainer, {
                        justifyContent: 'center',
                        paddingHorizontal: 15,
                    }]}

                    ListFooterComponent={
                        <View style={styles.footer}>
                            <View style={styles.buttonWrapper}>
                                <Button title="Sair" onPress={signOut} />
                            </View>
                        </View>
                    }
                />
            </View>
        );
    }



    const styles = StyleSheet.create({

        background: {
            flex: 1,
            backgroundColor: '#333333',
        },

        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12
        },

        loadingText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: '500'
        },

        scrollContainer: {
            padding: 20,
            paddingTop: 50,
            paddingBottom: 40,
        },
        
        header: {
            marginTop: 50,
            alignItems: 'center',
            marginBottom: 24,
            width: '100%',
        },
        text: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#FFF',
        },
        footer: {
            marginTop: 16,
            width: '100%',
            alignItems: 'center'
        },
        buttonWrapper: {
            width: 200,
        }
    });