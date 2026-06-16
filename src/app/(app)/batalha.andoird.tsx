import { getPokemon } from '@/services/api';
import { getTeam, updateTeam, addCapturedPokemon, deleteCapturedPokemon } from '@/services/pokemonService';
import { pokemon } from '@/@types/pokemon';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/button';
import { MenuAndroid } from '@/components/menu/index.android';

import FundoPoke from '@assets/images/Fundo_Dash.png';

import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';

// Converte o index "025" da PokeAPI para o id numérico esperado pelo backend (25).
const toId = (poke: pokemon) => parseInt(poke.index, 10);

export default function BatalhaAndroid() {
    const { userId } = useAuth();

    const [pokemonList, setPokemonList] = useState<pokemon[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<pokemon[]>([]);
    const [initialTeamIds, setInitialTeamIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadPokemons() {
            try {
                const data = await getPokemon(151);

                // Busca o time já salvo do usuário no backend.
                let teamIds: number[] = [];
                if (userId) {
                    try {
                        teamIds = await getTeam(userId);
                    } catch (teamError) {
                        console.error('Erro ao carregar o time do usuário:', teamError);
                    }
                }
                setInitialTeamIds(teamIds);

                // Pré-seleciona os pokémons do time salvo.
                const teamPokemon = data.filter(p => teamIds.includes(toId(p))).slice(0, 5);
                setSelectedTeam(teamPokemon);

                // Monta o pool: garante que o time apareça e completa com aleatórios até 25.
                const teamIndexes = new Set(teamPokemon.map(p => p.index));
                const restantes = data
                    .filter(p => !teamIndexes.has(p.index))
                    .sort(() => Math.random() - 0.5)
                    .slice(0, Math.max(0, 25 - teamPokemon.length));
                setPokemonList([...teamPokemon, ...restantes]);
            } catch (error) {
                console.error('Erro ao carregar lista de pokemons:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadPokemons();
    }, [userId]);

    const SelecionarTime = (poke: pokemon) => {
        const estaNoTime = selectedTeam.some(item => item.index === poke.index);

        if (estaNoTime) {
            // Remove do time e libera o pokémon capturado no backend.
            setSelectedTeam(selectedTeam.filter(item => item.index !== poke.index));
            if (userId) {
                deleteCapturedPokemon(userId, toId(poke)).catch(err =>
                    console.error('Erro ao remover pokémon capturado:', err)
                );
            }
        } else if (selectedTeam.length < 5) {
            // Adiciona ao time (limite de 5) e captura o pokémon no backend.
            setSelectedTeam([...selectedTeam, poke]);
            if (userId) {
                addCapturedPokemon(userId, toId(poke)).catch(err =>
                    console.error('Erro ao capturar pokémon:', err)
                );
            }
        }
    };

    async function salvarTime() {
        if (!userId) {
            Alert.alert('Atenção', 'Você precisa estar logado para salvar o time.');
            return;
        }

        const currentIds = selectedTeam.map(toId);
        const removed = initialTeamIds.filter(id => !currentIds.includes(id));
        const added = currentIds.filter(id => !initialTeamIds.includes(id));

        if (removed.length === 0 && added.length === 0) {
            Alert.alert('Time', 'Nenhuma alteração para salvar.');
            return;
        }

        try {
            setIsSaving(true);
            // Persiste cada troca (removido -> novo); sobras enviam o lado vazio.
            const trocas = Math.max(removed.length, added.length);
            for (let i = 0; i < trocas; i++) {
                await updateTeam(userId, removed[i] ?? '', added[i] ?? '');
            }
            setInitialTeamIds(currentIds);
            Alert.alert('Time salvo', 'Seu time foi atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar o time:', error);
            Alert.alert('Erro', 'Não foi possível salvar o time. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    }

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

                <View style={styles.saveButtonWrapper}>
                    <Button
                        title={isSaving ? 'Salvando...' : 'Salvar Time'}
                        onPress={salvarTime}
                        disabled={isSaving}
                    />
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
        marginBottom: 20,
    },
    saveButtonWrapper: {
        width: 220,
        marginBottom: 24,
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
