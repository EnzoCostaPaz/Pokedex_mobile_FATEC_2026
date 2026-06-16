import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/components/avatar/ProfileAvatar';
import { Menu } from '@/components/menu';
import { useAuth } from '@/context/AuthContext';

import { pokemon } from '@/@types/pokemon';
import { getPokemon } from '@/services/api';

const FundoPadrão = require('@assets/images/Fundo_Dash.png'); 

export default function ProfileScreen() {
    const { user } = useAuth();
    const [favoritePokemon, setFavoritePokemon] = useState<pokemon | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const trainerData = {
        name: typeof user === 'object' && user !== null ? ((user as any).displayName || (user as any).name || "Ash") : (user || "Ash"),
        age: 18,
        battlesPlayed: 350,
        battlesWon: 280,
        preferredType: "Elétrico / Fogo",
    };

    useEffect(() => {
        async function loadProfileAndFavorite() {
            try {
                const data = await getPokemon(25);
                const partner = data.find(p => p.index === "025") || data[0]; 
                setFavoritePokemon(partner);
            } catch (error) {
                console.error("Erro ao carregar dados do perfil:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfileAndFavorite();
    }, []);

    if (isLoading) {
        return (
            <View style={[styles.background, styles.center]}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Carregando Perfil...</Text>
            </View>
        );
    }

    const renderInfoRow = (key: string, value: string | number) => (
        <View style={styles.infoRow} key={key}>
            <Text style={styles.infoKey}>{key.toUpperCase()}:</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaProvider>
            <ImageBackground source={FundoPadrão} style={styles.background} resizeMode="cover">
                <Menu />
                <View style={styles.center}>
                    
                    <View style={styles.profileContainer}>
                        
                        <Text style={styles.title}>Perfil de Treinador</Text>
                        
                        <View style={styles.contentLayout}>
                            
                            {/* Esquerda: Avatar (Empurrado um pouco para a esquerda) */}
                            <View style={styles.leftSection}>
                                <ProfileAvatar 
                                    name={trainerData.name} 
                                    imageSource={require('@assets/images/ash_avatar.jpg')}
                                />
                            </View>
                            
                            {/* Linha Divisória Central */}
                            <View style={styles.divider} />
                            
                            {/* Direita: Contêiner dos Dois Cards */}
                            <View style={styles.cardsContainer}>
                                
                                {/* 1º Card: Informações do Perfil */}
                                <View style={styles.cardBase}>
                                    <Text style={styles.cardHeader}>Estatísticas</Text>
                                    <View style={styles.cardContentBox}>
                                        {renderInfoRow("Nome Completo", trainerData.name)}
                                        {renderInfoRow("Idade", trainerData.age)}
                                        {renderInfoRow("Batalhas Jogadas", trainerData.battlesPlayed)}
                                        {renderInfoRow("Batalhas Vencidas", trainerData.battlesWon)}
                                        {renderInfoRow("Tipo Preferido", trainerData.preferredType)}
                                    </View>
                                </View>

                                {/* 2º Card: Pokémon Favorito */}
                                <View style={styles.cardBase}>
                                    <Text style={styles.cardHeader}>Parceiro</Text>
                                    {favoritePokemon ? (
                                        <View style={styles.favoriteContentBox}>
                                            <Image 
                                                source={{ uri: favoritePokemon.imgPoke }} 
                                                style={styles.favoriteSprite}
                                            />
                                            <Text style={styles.favoriteName}>
                                                {favoritePokemon.nome.charAt(0).toUpperCase() + favoritePokemon.nome.slice(1)}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.favoriteContentBox}>
                                            <ActivityIndicator color="#FFF" />
                                        </View>
                                    )}
                                </View>

                            </View>
                            
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaProvider>
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
        gap: 16
    },
    loadingText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
    },
    profileContainer: {
        backgroundColor: '#efefef', 
        borderRadius: 20,
        padding: 30,
        width: '95%',
        minHeight: 450,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 15,
        justifyContent: 'center',
    },
    contentLayout: {
        flexDirection: 'row',
        alignItems: 'stretch', // Estica os filhos para terem a mesma altura
        justifyContent: 'space-between',
        width: '100%',
    },
    
    // Configurações de espaçamento lateral
    leftSection: {
        width: '32%', 
        justifyContent: 'center',
        alignItems: 'center', 
        paddingRight: 10,
    },
    divider: {
        width: 1.5,
        backgroundColor: 'rgba(0,0,0,0.2)', 
        marginHorizontal: 10,
        marginTop: 15,
        marginBottom: 15,
    },
    cardsContainer: {
        flex: 1, // Ocupa todo o resto do espaço (aprox. 68%)
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16, // Cria um espaço consistente entre os dois cards vermelhos
    },
    
    // Estilo Base para os dois cards vermelhos
    cardBase: {
        flex: 1, // Faz os dois cards dividirem o espaço 50/50
        backgroundColor: '#dc0a2d', 
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    cardHeader: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        paddingBottom: 8,
    },
    
    // Conteúdo interno do Card 1 (Stats)
    cardContentBox: {
        flex: 1,
        justifyContent: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    infoKey: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFF',
        width: '55%',
    },
    infoValue: {
        fontSize: 13,
        color: '#FFF',
        fontWeight: '600',
        width: '45%',
    },
    
    // Conteúdo interno do Card 2 (Pokémon)
    favoriteContentBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteSprite: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
    },
    favoriteName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 12,
    },
});