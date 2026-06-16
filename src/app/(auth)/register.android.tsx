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

export default function CadastrarUsuario() {
    const [name, setName] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [confirmarSenha, setConfirmarSenha] = useState<string>('');
    const { register } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function VerificarRegistro() {
        if (name.trim() === '' || senha.trim() === '' || confirmarSenha.trim() === '') {
            Alert.alert('Erro de Registro', 'Todos os campos devem estar preenchidos');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro de Registro', 'As senhas não coincidem');
            return;
        }

        try {
            setIsSubmitting(true);
            await register(name, senha);
            Alert.alert('Cadastro realizado', 'Conta criada com sucesso! Faça login para continuar.', [
                { text: 'OK', onPress: () => router.replace('/') },
            ]);
        } catch (error) {
            Alert.alert('Erro de Registro', 'Não foi possível concluir o cadastro. Tente outro usuário.');
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
                <Logo name={LogoIcon} size={350} />
                <View style={styles.logoContainer}>
                   <Text style={styles.title}>Faça seu cadastro para continuar</Text>
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

                    <Input
                        placeholder='Confirmar Senha'
                        secureTextEntry
                        onChangeText={setConfirmarSenha}
                        value={confirmarSenha}
                    />


                    <Button
                        title={isSubmitting ? 'Cadastrando...' : 'Registrar'}
                        onPress={VerificarRegistro}
                        disabled={isSubmitting}
                    />

                      <Button
                        title='Login2'
                        onPress={() => {router.replace('/')}}
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

