// src/app/(auth)/index.android.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Logo } from '@/components/logo';
import { useAuth } from '@/context/AuthContext';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function validarCredenciais() {
        if (name.trim() === '' || senha.trim() === '') {
            setAlertTitle('Erro de Autenticação');
            setAlertMessage('Preencha nome e senha!');
            setAlertVisible(true);
            return;
        }

        try {
            setIsSubmitting(true);
            await signIn(name, senha);
            router.replace('/batalha');
        } catch (error) {
            setAlertTitle('Erro de Autenticação');
            setAlertMessage('Nome ou senha incorretos!');
            setAlertVisible(true);
        } finally {
            setIsSubmitting(false);
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
                    <Logo name={LogoIcon} size={285} key="LogoLogin"/>
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
                        title={isSubmitting ? 'Entrando...' : 'Login'}
                        onPress={validarCredenciais}
                        disabled={isSubmitting}
                    />
                     <Button
                        title='Registrar'
                        onPress={() => { router.replace('/(auth)/register') }}
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