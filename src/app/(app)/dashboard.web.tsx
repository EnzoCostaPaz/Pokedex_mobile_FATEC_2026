// src/app/(app)/dashboard.tsx
import { View, Text, StyleSheet, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

import { Menu } from '@/components/menu';
import { useAuth } from '@/context/AuthContext';
import FundoPoke from '@assets/images/Fundo_Dash.png';

import React from 'react';

import { Card } from '@/components/card';
import { getPokemon } from '@/services/api';
import { pokemon } from '@/@types/pokemon';

export default function Dashboard() {
    const { signOut } = useAuth();

    const [pokemonList, setPokemonList] = useState<pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPokemons() {
            try {
                const data = await getPokemon(151);
                setPokemonList(data);
            } catch (error) {
                console.error("Erro ao carregar lista de pokemons:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadPokemons();
    }, []);

    if (isLoading) {
        return (
            <ImageBackground source={FundoPoke} style={[styles.background, styles.center]} resizeMode="cover">
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Carregando Pokédex...</Text>
            </ImageBackground>
        );
    }

    const renderPokemonCard = ({ item }: { item: pokemon }) => {
        const pokemonStats = item.poderes.map((p, index) => (
            <Text key={index}>
                <Text style={{ fontWeight: 'bold' }}>{p.nome.toUpperCase()}:</Text> {p.forcaPoke}
            </Text>
        ));

        // Dicionário de tradução dos tipos da API para o seu componente Web
        const typeMap: Record<string, 'normal' |
            'fogo' |
            'eletrico' |
            'agua' |
            'grama' |
            'fada' |
            'fantasma' |
            'metal' |
            'gelo' |
            'lutador' |
            'psicico' |
            'veneno' |
            'voador' |
            'dragao' |
            'pedra' |
            'rocha' |
            'inseto'> = {

            normal: 'normal',
            fire: 'fogo',
            water: 'agua',
            electric: 'eletrico',
            grass: 'grama',
            fairy: 'fada',
            ghost: 'fantasma',
            steel: 'metal',
            ice: 'gelo',
            fighting: 'lutador',
            psychic: 'psicico',
            poison: 'veneno',
            flying: 'voador',
            dragon: 'dragao',
            rock: 'pedra',
            ground: 'rocha',
            bug: 'inseto'
        };

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
        <ImageBackground
            source={FundoPoke}
            style={styles.background}
            resizeMode="cover"
        >
            <Menu />
            <Text style={styles.text}>Sua Pokédex</Text>

            <FlatList
                data={pokemonList}
                keyExtractor={(item) => item.index}
                renderItem={renderPokemonCard}
                contentContainerStyle={[styles.scrollContainer, {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }]}

            />
        </ImageBackground>
    );
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
    scrollContainer: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
        width: '100%',
    },
    text: {
        display: 'flex',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF'
    },
    footerContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonWrapper: {
        width: 200,
    }
});