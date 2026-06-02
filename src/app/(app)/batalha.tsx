import { getPokemon } from '@/services/api';
import { pokemon } from '@/@types/pokemon';
import { useAuth } from '@/context/AuthContext';
import { Menu } from '@/components/menu';

import FundoPoke from '@assets/images/Fundo_Dash.png';

import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function Batalha() {

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
            <ImageBackground source={FundoPoke} style={[styles.background, styles.center]} resizeMode="cover">
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
        // 1. Removido o 'styles.center' daqui
        <ImageBackground source={FundoPoke} style={styles.background} resizeMode="cover">
            
            {/* 2. O Menu sobe para cá, ficando livre das restrições do mainContainer */}
            <Menu />

            <View style={styles.mainContainer}>
                <Text style={styles.title}>Escolha seu Time</Text>
                
                <View style={styles.teamContainer}>
                    {renderTeamSlots()}
                </View>

                <FlatList
                    data={pokemonList}
                    keyExtractor={(item) => item.index}
                    contentContainerStyle={styles.gridContainer}
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
    background: {
        width: '100%',
        height: '100%',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },

    mainContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20, 
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 30,
    },

    
    teamContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        gap: 24, 
        justifyContent: 'center',
        marginBottom: 60, 
    },
    slotBox: {
        width: 120, 
        height: 120,
        backgroundColor: 'rgba(217, 217, 217, 0.7)', 
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slotImage: {
        width: 120,
        height: 120,
    },
    plusSign: {
        fontSize: 80,
        color: '#000', 
        fontWeight: '400',
    },

    gridContainer: {
        flexDirection: 'row',       
        flexWrap: 'wrap',           
        justifyContent: 'center',   
        alignItems: 'center',
        paddingBottom: 40,
        maxWidth: 1000,             
        width: '100%',
        alignSelf: 'center',        
    },
    gridRow: {
        gap: 16, 
        marginBottom: 16, 
    },
    poolBox: {
        width: 90, 
        height: 90,
        backgroundColor: 'rgba(217, 217, 217, 0.7)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    poolBoxSelected: {
        backgroundColor: 'rgba(227, 53, 13, 0.8)', 
        borderWidth: 2,
        borderColor: '#FFF',
    },
    poolImage: {
        width: 70,
        height: 70,
    }
})