import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Logo } from '@/components/logo';
import LogoIcon from '@assets/images/LogoPoke.svg';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

export function MenuAndroid() {
    const { signOut } = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.containerAndroid,
            { paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 25 }
        ]}>
            
            <View style={styles.sideGroupAndroid}>
                <TouchableOpacity style={styles.menuItemAndroid} onPress={() => router.replace('/(app)/perfil')}>
                    <Text style={styles.menuTextAndroid}>Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItemAndroid} onPress={() => router.replace('/(app)/batalha.andoird')}>
                    <Text style={styles.menuTextAndroid}>Batalhas</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.logoWrapper}>
                <Logo name={LogoIcon} size={60} />
            </View>

            <View style={styles.sideGroupAndroid}>
                <TouchableOpacity style={styles.menuItemAndroid} onPress={() => router.replace('/dashboard')}>
                    <Text style={styles.menuTextAndroid}>Pokédex</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItemAndroid} onPress={signOut}>
                    <Text style={styles.menuTextAndroid}>Sair</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}