import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Logo } from '@/components/logo';
import { useAuth } from '@/context/AuthContext';

import { Alert } from '@/components/alert';

import FundoLogin from '@assets/images/Fundo_Login.png'; 
import LogoIcon from '@assets/images/LogoPoke.svg'; 
import React from 'react';

export default function CadastrarUsuario() {
    const [name, setName] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [confirmarSenha, setConfirmarSenha] = useState<string>('');

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('error');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();

    function showAlert(title: string, message: string, type: 'success' | 'error') {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    }

    async function VerificarRegistro() {
        if (name.trim() === '' || senha.trim() === '' || confirmarSenha.trim() === '') {
            showAlert('Erro de Registro', 'Todos os campos são obrigatórios!', 'error');
            return;
        }

        if (senha !== confirmarSenha) {
            showAlert('Erro de Registro', 'As senhas não coincidem!', 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            await register(name, senha);
            showAlert('Cadastro realizado', 'Conta criada com sucesso! Faça login para continuar.', 'success');
        } catch (error) {
            showAlert('Erro de Registro', 'Não foi possível concluir o cadastro. Tente outro usuário.', 'error');
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
                    <Logo name={LogoIcon} size={285} key= "LogoRegister"/>
                    <Text style={styles.title}>Faça seu cadastro para continuar</Text>
                </View>

                <View style={styles.formContainer}>

                    <Input
                        placeholder='Nome'
                        onChangeText={setName}
                        value={name}
                    />

                    <Input
                        id='SenhaTXT'
                        placeholder='Senha'
                        secureTextEntry
                        onChangeText={setSenha}
                        value={senha}
                    />

                    <Input

                        id='ConfirmarSenhaTXT'
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
                        title='Login'
                        onPress={() => { router.replace('/') }}
                    />
                </View>

            </View>

            <Alert
                title={alertTitle}
                message={alertMessage}
                visible={alertVisible}
                onClose={() => {
                    setAlertVisible(false);
                    if (alertType === 'success') {
                        router.replace('/_sitemap');
                    }
                }}
                type={alertType}
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