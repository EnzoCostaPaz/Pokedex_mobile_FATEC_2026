import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/components/avatar/ProfileAvatar';
import { MenuAndroid } from '@/components/menu/index.android';
import { useAuth } from '@/context/AuthContext';

import { pokemon } from '@/@types/pokemon';
import { getPokemon } from '@/services/api';

const FundoPadrao = require('@assets/images/Fundo_Dash.png');
const AshAvatar = require('@assets/images/ash_avatar.jpg');

export default function ProfileScreenAndroid() {
    const { user } = useAuth();
    const [favoritePokemon, setFavoritePokemon] = useState<pokemon | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    const trainerData = {
        name: user || 'Ash',
        age: 18,
        battlesPlayed: 350,
        battlesWon: 280,
        preferredType: 'Elétrico / Fogo',
    };

    useEffect(() => {
        async function loadProfileAndFavorite() {
            try {
                const data = await getPokemon(25);
                const partner = data.find(p => p.index === '025') || data[0];
                setFavoritePokemon(partner);
            } catch (error) {
                console.error('Erro ao carregar dados do perfil:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfileAndFavorite();
    }, []);

    // Pede permissão, abre a galeria do celular e salva a URI da foto escolhida.
    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Erro ao abrir a galeria:', error);
        }
    };

    const renderInfoRow = (key: string, value: string | number) => (
        <View style={styles.infoRow} key={key}>
            <Text style={styles.infoKey}>{key.toUpperCase()}:</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.background, styles.center]}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Carregando Perfil...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <ImageBackground source={FundoPadrao} style={styles.background} resizeMode="cover">
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.profileContainer}>
                        <Text style={styles.title}>Perfil de Treinador</Text>

                        <View style={styles.avatarSection}>
                            <ProfileAvatar
                                name={trainerData.name}
                                imageSource={avatarUri ? { uri: avatarUri } : AshAvatar}
                            />
                            <TouchableOpacity style={styles.editButton} onPress={pickImage}>
                                <Text style={styles.editButtonText}>Escolher Foto</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Card Estatísticas (empilhado) */}
                        <View style={styles.cardBase}>
                            <Text style={styles.cardHeader}>Estatísticas</Text>
                            <View style={styles.cardContentBox}>
                                {renderInfoRow('Nome Completo', trainerData.name)}
                                {renderInfoRow('Idade', trainerData.age)}
                                {renderInfoRow('Batalhas Jogadas', trainerData.battlesPlayed)}
                                {renderInfoRow('Batalhas Vencidas', trainerData.battlesWon)}
                                {renderInfoRow('Tipo Preferido', trainerData.preferredType)}
                            </View>
                        </View>

                        {/* Card Parceiro (empilhado) */}
                        <View style={styles.cardBase}>
                            <Text style={styles.cardHeader}>Parceiro</Text>
                            {favoritePokemon ? (
                                <View style={styles.favoriteContentBox}>
                                    <Image source={{ uri: favoritePokemon.imgPoke }} style={styles.favoriteSprite} />
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
                </ScrollView>

                <MenuAndroid />
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
        gap: 16,
    },
    loadingText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    scrollContent: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 130,
        alignItems: 'center',
    },
    profileContainer: {
        backgroundColor: '#efefef',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 15,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 16,
    },
    avatarSection: {
        marginBottom: 8,
        alignItems: 'center',
    },
    editButton: {
        marginTop: 15,
        backgroundColor: '#dc0a2d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 3,
    },
    editButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardBase: {
        width: '100%',
        backgroundColor: '#dc0a2d',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
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
    cardContentBox: {
        justifyContent: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    infoKey: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        width: '55%',
    },
    infoValue: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
        width: '45%',
    },
    favoriteContentBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    favoriteSprite: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    favoriteName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 12,
    },
});
