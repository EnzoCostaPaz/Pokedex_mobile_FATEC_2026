import { getPokemon } from '@/services/api';
import { pokemon } from '@/@types/pokemon';
import { MenuAndroid } from '@/components/menu/index.android';

import FundoPoke from '@assets/images/Fundo_Dash.png';

import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function BatalhaAndroid() {
    const [pokemonList, setPokemonList] = useState<pokemon[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPokemons() {
            try {
                const data = await getPokemon(151);
                const embararlhar = data.sort(() => Math.random() - 0.5);
                const escolher25 = embararlhar.slice(0, 25);
                setPokemonList(escolher25);

            } catch (error) {
                console.error("Erro ao carregar lista de pokemons:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadPokemons();
    }, []);

    const SelecionarTime = (poke: pokemon) => {
        const estaNoTime = selectedTeam.some(item => item.index === poke.index);

        if (estaNoTime) {
            // Remove se já estiver no time
            setSelectedTeam(selectedTeam.filter(item => item.index !== poke.index));
        } else {
            // Adiciona se houver espaço (limite de 5)
            if (selectedTeam.length < 5) {
                setSelectedTeam([...selectedTeam, poke]);
            }
        }
    };

    if (isLoading) {
        return (
            <ImageBackground source={FundoPoke} style={[styles.backgroundAndroid, styles.centerAndroid]} resizeMode="cover">
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Carregando Pokédex...</Text>
            </ImageBackground>
        );
    }

    const renderTeamSlots = () => {
        const slots = [];
        for (let i = 0; i < 5; i++) {
            const poke = selectedTeam[i];
            slots.push(
                <TouchableOpacity
                    key={i}
                    style={styles.slotBox}
                    onPress={() => poke && SelecionarTime(poke)}
                    activeOpacity={poke ? 0.7 : 1}
                >
                    {poke ? (
                        <Image source={{ uri: poke.imgPoke }} style={styles.slotImage} resizeMode="contain" />
                    ) : (
                        <Text style={styles.plusSign}>+</Text>
                    )}
                </TouchableOpacity>
            );
        }
        return slots;
    };

    return (
        <ImageBackground source={FundoPoke} style={[styles.backgroundAndroid, styles.centerAndroid]} resizeMode="cover">

            <View style={styles.mainContainer}>
                <MenuAndroid />

                {/* --- SEÇÃO DO TOPO (TIME) --- */}
                <Text style={styles.title}>Escolha seu Time</Text>
                <View style={styles.teamContainer}>
                    {renderTeamSlots()}
                </View>

                {/* --- SEÇÃO DE BAIXO (LISTA DOS 25) --- */}
                {/* Usamos 5 colunas para formar um bloco perfeito 5x5 no mobile */}
                <FlatList
                    data={pokemonList}
                    keyExtractor={(item) => item.index}
                    numColumns={5}
                    contentContainerStyle={styles.gridContainer}
                    columnWrapperStyle={styles.gridRow}
                    showsVerticalScrollIndicator={false} // Esconde a barra de rolagem nativa para ficar mais limpo
                    renderItem={({ item }) => {
                        const isSelected = selectedTeam.some(selected => selected.index === item.index);
                        return (
                            <TouchableOpacity
                                style={[styles.poolBox, isSelected && styles.poolBoxSelected]}
                                onPress={() => SelecionarTime(item)}
                                activeOpacity={0.7}
                            >
                                <Image source={{ uri: item.imgPoke }} style={styles.poolImage} resizeMode="contain" />
                            </TouchableOpacity>
                        );
                    }}
                />

            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    backgroundAndroid: {
        width: '100%',
        height: '100%',
    },
    centerAndroid: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    mainContainer: {
        paddingBottom: 80,
        flex: 1,
        alignItems: 'center',
        paddingTop: 40, 
    },
    title: {
        fontSize: 32, 
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
    },

    teamContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 40,
    },
    slotBox: {
        width: 60, 
        height: 60,
        backgroundColor: 'rgba(217, 217, 217, 0.7)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slotImage: {
        width: 50,
        height: 50,
    },
    plusSign: {
        fontSize: 36, 
        color: '#000',
        fontWeight: '400',
    },

    gridContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    gridRow: {
        gap: 8,
        marginBottom: 8, 
        justifyContent: 'center',
    },
    poolBox: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(217, 217, 217, 0.7)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    poolBoxSelected: {
        backgroundColor: 'rgba(227, 53, 13, 0.8)',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    poolImage: {
        width: 50,
        height: 50,
    }
});