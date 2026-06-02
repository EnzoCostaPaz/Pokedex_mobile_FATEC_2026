import React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/button';
import { styles } from './styles';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/logo';

import { router } from 'expo-router';

import LogoIcon from '@assets/images/LogoPoke.svg';


export function Menu() {

    const { signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Button title="Perfil" onPress={() => { }} />
            <Button title="Batalhas" onPress={() => { router.replace('/batalha') }} />

            <Logo name={LogoIcon} size={200} style={styles.logo} />

            <Button title="Pokedex" onPress={() => { router.replace('/dashboard') }} />
            <Button title="Sair" onPress={() => { signOut() }} />
        </View>

    )
}