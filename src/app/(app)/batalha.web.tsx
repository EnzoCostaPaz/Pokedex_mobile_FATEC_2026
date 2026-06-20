import { getPlayerPokemons, updateTeam } from '@/services/pokemonService';
import { pokemon } from '@/@types/pokemon';
import { useAuth } from '@/context/AuthContext';
import { Menu } from '@/components/menu';
import { Button } from '@/components/button';
import { Alert } from '@/components/alert';

import FundoPoke from '@assets/images/Fundo_Dash.png';

import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

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
            if (!userId) return;

            try {
                
                const { team, capture } = await getPlayerPokemons(userId);

                
                setSelectedTeam(team.slice(0, 5));
                setInitialTeamIds(team.map(toId));

                const porIndex = new Map<string, pokemon>();
                [...capture, ...team].forEach(p => porIndex.set(p.index, p));
                setPokemonList(Array.from(porIndex.values()));

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

    async function salvarTime() {
        if (!userId) {
            showAlert('Atenção', 'Você precisa estar logado para salvar o time.', 'error');
            return;
        }

        const currentIds = selectedTeam.map(toId);
        const removed = initialTeamIds.filter(id => !currentIds.includes(id));
        const added = currentIds.filter(id => !initialTeamIds.includes(id));

        if (removed.length === 0 && added.length === 0) {
            showAlert('Time', 'Nenhuma alteração para salvar.', 'success');
            return;
        }

        try {
            setIsSaving(true);

            const trocas = Math.max(removed.length, added.length);
            for (let i = 0; i < trocas; i++) {
                await updateTeam(userId, removed[i] || 0, added[i] || 0);
            }

            setInitialTeamIds(currentIds);
            showAlert('Time salvo', 'Seu time de batalha foi atualizado com sucesso!', 'success');
        } catch (error: any) {
            console.error('Erro ao salvar o time:', error.response?.data || error.message);
            showAlert('Erro', 'Não foi possível salvar o time de batalha.', 'error');
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <ImageBackground source={FundoPoke} style={[styles.background, styles.center]} resizeMode="cover">
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Carregando Área de Batalha...</Text>
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

    const colecaoDisponivel = pokemonList.filter(
        p => !selectedTeam.some(s => s.index === p.index)
    );

    return (
        <ImageBackground source={FundoPoke} style={styles.background} resizeMode="cover">
            <Menu />

            <View style={styles.mainContainer}>
                <Text style={styles.title}>Seu Time de Batalha</Text>

                <View style={styles.teamContainer}>
                    {renderTeamSlots()}
                </View>

                <View style={styles.saveButtonWrapper}>
                    <Button
                        title={isSaving ? 'Salvando...' : 'Confirmar Escalada'}
                        onPress={salvarTime}
                        disabled={isSaving}
                    />
                </View>

                <Text style={styles.sectionTitle}>Sua Coleção de Pokémon ({colecaoDisponivel.length})</Text>

                <FlatList
                    data={colecaoDisponivel}
                    keyExtractor={(item) => item.index}
                    contentContainerStyle={styles.gridContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Você não possui nenhum Pokémon capturado ainda.</Text>
                    }
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
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 2,
        textShadowOffset: { width: 1, height: 1 }
    },
    emptyText: {
        color: '#FFF',
        fontSize: 16,
        marginTop: 20,
        fontStyle: 'italic'
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
        alignSelf: 'center' 
    },
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
        borderColor: '#FFF' 
    },
    RemoverBotaoTexto: { 
        color: '#FFF', 
        fontSize: 28, 
        fontWeight: 'bold', 
        lineHeight: 30
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
        borderColor: '#FFF' 
    },
    poolImage: { 
        width: 70, 
        height: 70 
    }
});

