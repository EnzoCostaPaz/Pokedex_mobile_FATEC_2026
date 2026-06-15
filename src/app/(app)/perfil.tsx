import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Seus componentes e contextos padrão
import { Menu } from '@/components/menu';
import { useAuth } from '@/context/AuthContext';

// Importando o serviço da API e a tipagem
import { pokemon } from '@/@types/pokemon';
import { getPokemon } from '@/services/api';

// Asset de fundo (padrão de Pokébola) - Substitua pelo asset correto se houver no projeto
const FundoPadrão = require('@assets/images/Fundo_Dash.png'); 

export default function ProfileScreen() {
    const { user } = useAuth();
    const [favoritePokemon, setFavoritePokemon] = useState<pokemon | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showFavoritePokemon, setShowFavoritePokemon] = useState(false);

    // Dados de exemplo do treinador para os campos estáticos
    const trainerData = {
        name: typeof user === 'object' && user !== null ? ((user as any).displayName || (user as any).name || "Ash") : (user || "Ash"),
        age: 18,
        battlesPlayed: 350,
        battlesWon: 280,
        preferredType: "Tech / Code",
    };

    useEffect(() => {
        async function loadProfileAndFavorite() {
            try {
                // CORREÇÃO LINHAS 36 e 37:
                // Buscamos a lista até o 25º Pokémon e procuramos o favorito (Pikachu) pelo index.
                // Como getPokemon retorna um array, usamos o .find() para isolar apenas um objeto.
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

    // Função para renderizar as linhas de informação no card
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
                    
                    {/* Contêiner central do Perfil */}
                    <View style={styles.profileContainer}>
                        
                        <Text style={styles.title}>Perfil de Treinador</Text>
                        
                        <View style={styles.contentLayout}>
                            
                            {/* Lado Esquerdo */}
                            <View style={styles.leftSection}>
                                <View style={styles.avatarContainer}>
                                    <Image 
                                        source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png' }} 
                                        style={styles.avatarImage}
                                    />
                                </View>
                                <Text style={styles.trainerName}>{trainerData.name}</Text>
                            </View>
                            
                            {/* Linha Divisória */}
                            <View style={styles.divider} />
                            
                            {/* Lado Direito (Clicável) */}
                            <TouchableOpacity style={styles.rightSection} onPress={() => setShowFavoritePokemon(true)}>
                                <View style={styles.infoCard}>
                                    {renderInfoRow("Nome Completo", trainerData.name)}
                                    {renderInfoRow("Idade", trainerData.age)}
                                    {renderInfoRow("Batalhas Jogadas", trainerData.battlesPlayed)}
                                    {renderInfoRow("Batalhas Vencidas", trainerData.battlesWon)}
                                    {renderInfoRow("Tipo Preferido", trainerData.preferredType)}
                                </View>
                            </TouchableOpacity>
                            
                        </View>
                        
                    </View>
                    
                    {/* CORREÇÃO LINHA 125: Fechando a condicional corretamente com ")}" */}
                    {showFavoritePokemon && favoritePokemon && (
                        <View style={styles.favoritePokemonOverlay}>
                            <View style={styles.favoritePokemonCard}>
                                <Text style={styles.favoritePokemonTitle}>Pokémon Favorito</Text>
                                <Image 
                                    source={{ uri: favoritePokemon.imgPoke }} 
                                    style={styles.favoritePokemonSprite}
                                />
                                <Text style={styles.favoritePokemonName}>
                                    {favoritePokemon.nome.charAt(0).toUpperCase() + favoritePokemon.nome.slice(1)}
                                </Text>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setShowFavoritePokemon(false)}>
                                    <Text style={styles.closeButtonText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

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
        borderRadius: 16,
        padding: 24,
        width: '90%',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },

    contentLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },

    leftSection: {
        alignItems: 'center',
        width: '45%',
    },

    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333', 
        height: 140,
        width: 140,
        borderRadius: 70, 
        borderWidth: 2,
        borderColor: '#555555',
        overflow: 'hidden',
    },

    avatarImage: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
    },

    trainerName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 0.5,
        marginTop: 16,
        textAlign: 'center',
    },

    divider: {
        width: 2,
        height: '100%',
        backgroundColor: '#000000', 
    },

    rightSection: {
        width: '45%',
    },

    infoCard: {
        backgroundColor: '#dc0a2d', 
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },

    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },

    infoKey: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        width: '60%',
    },

    infoValue: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
        width: '40%',
    },

    favoritePokemonOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    favoritePokemonCard: {
        backgroundColor: '#dc0a2d', 
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },

    favoritePokemonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 16,
    },

    favoritePokemonSprite: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },

    favoritePokemonName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 12,
        marginBottom: 16,
    },

    closeButton: {
        backgroundColor: '#efefef', 
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    closeButtonText: {
        color: '#333333', 
        fontWeight: 'bold',
        fontSize: 14,
    },
});