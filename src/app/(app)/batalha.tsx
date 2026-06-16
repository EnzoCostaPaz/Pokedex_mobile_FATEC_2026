import { getPokemon } from '@/services/api';
import { getTeam, addCapturedPokemon, deleteCapturedPokemon } from '@/services/pokemonService';
import { loadLocalTeam, saveLocalTeam } from '@/services/teamStorage';
import { pokemon } from '@/@types/pokemon';
import { useAuth } from '@/context/AuthContext';
import { Menu } from '@/components/menu';
import { Button } from '@/components/button';
import { Alert } from '@/components/alert';

import FundoPoke from '@assets/images/Fundo_Dash.png';

import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

// Converte o index "025" da PokeAPI para o id numérico esperado pelo backend (25).
const toId = (poke: pokemon) => parseInt(poke.index, 10);

export default function Batalha() {
    const { userId } = useAuth();

    const [pokemonList, setPokemonList] = useState<pokemon[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<pokemon[]>([]);
    const [initialTeamIds, setInitialTeamIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    function showAlert(title: string, message: string, type: 'success' | 'error') {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    }

    useEffect(() => {
        async function loadPokemons() {
            try {
                const data = await getPokemon(151);

                // 1. Time salvo no backend (pode não refletir os capturados).
                let teamIds: number[] = [];
                if (userId) {
                    try {
                        teamIds = await getTeam(userId);
                    } catch (teamError) {
                        console.error('Erro ao carregar o time do usuário:', teamError);
                    }
                }

                // 2. Time salvo localmente — fonte confiável para reexibir após sair da página.
                const localIds = await loadLocalTeam(userId);
                const effectiveIds = localIds.length ? localIds : teamIds;
                setInitialTeamIds(effectiveIds);

                // Pré-seleciona os pokémons do time salvo.
                const teamPokemon = data.filter(p => effectiveIds.includes(toId(p))).slice(0, 5);
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
            setSelectedTeam(selectedTeam.filter(item => item.index !== poke.index));
        } else if (selectedTeam.length < 5) {
            setSelectedTeam([...selectedTeam, poke]);
        }
    };

    // Apenas UMA declaração da função salvarTime, devidamente fechada!
    async function salvarTime() {
        if (!userId) {
            showAlert(
                'Sessão inválida',
                'Não há userId na sessão (o login não retornou um id reconhecido). Saia e entre novamente.',
                'error'
            );
            return;
        }

        const currentIds = selectedTeam.map(toId);
        const removed = initialTeamIds.filter(id => !currentIds.includes(id));
        const added = currentIds.filter(id => !initialTeamIds.includes(id));

        console.log('[salvarTime] userId:', userId, '| removidos:', removed, '| adicionados:', added);

        if (removed.length === 0 && added.length === 0) {
            showAlert('Time', 'Nenhuma alteração para salvar.', 'success');
            return;
        }

        try {
            setIsSaving(true);

            for (const idToRemove of removed) {
                await deleteCapturedPokemon(userId, idToRemove);
            }

            for (const idToAdd of added) {
                await addCapturedPokemon(userId, idToAdd);
            }

            // Persiste localmente para reexibir o time ao voltar à página.
            await saveLocalTeam(userId, currentIds);
            setInitialTeamIds(currentIds);
            showAlert('Time salvo', 'Seu time foi atualizado com sucesso!', 'success');
        } catch (error: any) {
            const status = error?.response?.status;
            const corpo = error?.response?.data;
            const detalhe = status
                ? `HTTP ${status}: ${typeof corpo === 'string' ? corpo : JSON.stringify(corpo)}`
                : (error?.message ?? 'Erro desconhecido');
            console.error('Erro ao salvar o time:', detalhe);
            showAlert('Erro ao salvar', detalhe, 'error');
        } finally {
            setIsSaving(false);
        }
    } // <--- FIM DA FUNÇÃO SALVAR TIME AQUI

    // O restante do código de renderização fica SOLTO dentro do componente principal
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
                <View key={i} style={styles.slotBox}>
                    {poke ? (
                        <>
                            <Image source={{ uri: poke.imgPoke }} style={styles.slotImage} resizeMode="contain" />

                            <TouchableOpacity
                                style={styles.BotaoRemover}
                                onPress={() => SelecionarTime(poke)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.RemoverBotaoTexto}> - </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.plusSign}>+</Text>
                    )}
                </View>
            );
        }
        return slots;
    };

    return (
        <ImageBackground source={FundoPoke} style={styles.background} resizeMode="cover">
            <Menu />

            <View style={styles.mainContainer}>
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

            <Alert
                title={alertTitle}
                message={alertMessage}
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
                type={alertType}
            />
        </ImageBackground>
    );
}

// Estilos continuam exatamente iguais
const styles = StyleSheet.create({
    background: { 
        width: '100%', 
        height: '100%' 
    },

    center: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 16 
    },

    loadingText: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#FFF' 
    },

    mainContainer: { 
        flex: 1, 
        alignItems: 'center', 
        paddingTop: 20 
    },

    title: { 
        fontSize: 48, 
        fontWeight: 'bold', 
        color: '#FFF', 
        marginBottom: 30 
    },

    teamContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 24, 
        justifyContent: 'center', 
        marginBottom: 24 
    },

    saveButtonWrapper: { 
        width: 240, 
        marginBottom: 36 
    },

    slotBox: { 
        width: 120, 
        height: 120, 
        backgroundColor: 'rgba(217, 217, 217, 0.7)', 
        borderRadius: 16, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    slotImage: { 
        width: 120, 
        height: 120 
    },

    plusSign: { 
        fontSize: 80, 
        color: '#000', 
        fontWeight: '400' 
    },

    gridContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingBottom: 40, 
        maxWidth: 1000,
        width: '100%', 
        alignSelf: 'center' },

    BotaoRemover: { 
        position: 'absolute', 
        bottom: -10, 
        right: -10, 
        width: 36, 
        height: 36, 
        backgroundColor: '#D32F2F', 
        borderRadius: 18, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: '#FFF', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 2 },

    RemoverBotaoTexto: { 
        color: '#FFF', 
        fontSize: 28, 
        fontWeight: 'bold', 
        lineHeight: 30 },

    gridRow: { 
        gap: 16, 
        marginBottom: 16 
    },

    poolBox: { 
        width: 90, 
        height: 90, 
        backgroundColor: 'rgba(217, 217, 217, 0.7)', 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: 8 
    },

    poolBoxSelected: { 
        backgroundColor: 'rgba(227, 53, 13, 0.8)', 
        borderWidth: 2, 
        borderColor: '#FFF' },

    poolImage: { 
        width: 70,
        height: 70 
    }
});