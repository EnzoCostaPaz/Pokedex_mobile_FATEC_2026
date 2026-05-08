import { View, Text, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useAuth } from '@/context/AuthContext';

import { Logo } from '@/components/logo';
import LogoIcon from '@assets/images/LogoPoke.svg';
import FundoLogin from '@assets/images/Fundo_Login.png'; 
import React from 'react';

export default function IndexAndroid() {
    const [name, setName] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const { signIn } = useAuth();

    function validarCredenciais() {
        const usuarioMock = "Ash";
        const senhaMock = "1234";

        if (name === usuarioMock && senha === senhaMock) {
            signIn(name);
            router.replace('/dashboard');
        } else {
            Alert.alert('Erro de Autenticação', 'Nome ou senha incorretos!');
        }
    }

    return (
        <ImageBackground
            source={FundoLogin}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Logo name={LogoIcon} size={350} />
                <View style={styles.logoContainer}>
                   <Text style={styles.title}>Bem Vindo a sua Pokedex</Text>
                </View>

                <View style={styles.formContainer}>
                    <Input
                        placeholder='Nome'
                        onChangeText={setName}
                        value={name}
                    />

                    <Input
                        placeholder='Senha'
                        secureTextEntry
                        onChangeText={setSenha}
                        value={senha}
                    />

                    <Button
                        title='Login'
                        onPress={validarCredenciais}
                    />
                </View>

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center', 
    },
   logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    title: {
        color: '#fff', 
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    formContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        padding: 24,
        borderRadius: 12, 
        alignItems: 'center',
    },
});