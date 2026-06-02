// src/app/(auth)/index.android.tsx
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/logo'; 

import { Alert } from '@/components/alert'; 

import FundoLogin from '@assets/images/Fundo_Login.png'; 
import LogoIcon from '@assets/images/LogoPoke.svg'; 
import React from 'react';

export default function IndexAndroid() {
    const [name, setName] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const { signIn } = useAuth();

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    function validarCredenciais() {
        const usuarioMock = "Ash";
        const senhaMock = "1234";

        if (name === usuarioMock && senha === senhaMock) {
            signIn(name);
            router.replace('/batalha');
        } else {
            setAlertTitle('Erro de Autenticação');
            setAlertMessage('Nome ou senha incorretos!');
            setAlertVisible(true);
        }
    }

    return (
        <ImageBackground
            source={FundoLogin}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                
                <View style={styles.logoContainer}>
                    <Logo name={LogoIcon} size={285} />
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

            <Alert 
                title={alertTitle}
                message={alertMessage}
                visible={alertVisible}
                onClose={() => setAlertVisible(false)} 
                type="error" 
            />

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
        marginTop: 10,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        padding: 24,
        borderRadius: 12, 
        alignItems: 'center',
    }
});