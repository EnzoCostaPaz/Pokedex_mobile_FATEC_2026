// src/app/(app)/dashboard.tsx
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Button } from '@/components/button';
import { useAuth } from '@/context/AuthContext';
import FundoPoke from '@assets/images/Fundo_Dash.png';

import { Card } from '@/components/card';
import flarom from '@assets/images/flareon.gif';
import eevee from '@assets/images/eevee.gif';
import vaporeon from '@assets/images/vaporeon.gif';
import jolteon from '@assets/images/jolteon.gif';
import React from 'react';

export default function Dashboard() {
    const { signOut } = useAuth();

   const TextMock = {
        eevee: (
            <>
                Pokémon de Tipo <Text style={{ fontWeight: 'bold' }}>Normal</Text>, sua genética instável pode de repente mudar notavelmente do ambiente onde vive, abrindo um diverso leque de Evoluções para esta espécie. Possíveis evoluções: <Text style={{ fontWeight: 'bold' }}>Vaporeon, Jolteon, Flareon</Text>.
            </>
        ),
        jolteon: (
            <>
                Pokémon de Tipo <Text style={{ fontWeight: 'bold' }}>Elétrico</Text>, um pokémon extramente temperamental, quando fica furioso, seu pelo fica mais afiado que agulhas. Consegue carregar seu corpo com uma carga maior que 10.000 volts. Evolui de: <Text style={{ fontWeight: 'bold' }}>Eevee</Text>.
            </>
        ),
        vaporeon: (
            <>
                Pokémon de Tipo <Text style={{ fontWeight: 'bold' }}>Água</Text>, sua estrutura celular é extremamente parecida com moléculas de água, permitindo com que este pokémon consiga derreter e ficar praticamente invisível em corpos d'água. Evolui de: <Text style={{ fontWeight: 'bold' }}>Eevee</Text>.
            </>
        ),
        flarom: (
            <>
                Pokémon de Tipo <Text style={{ fontWeight: 'bold' }}>Fogo</Text>, estoca energia termal dentro de sua grande pelagem, fazendo com que seu corpo passe da temperatura de 1650 graus Fahrenheit. Evolui de: <Text style={{ fontWeight: 'bold' }}>Eevee</Text>.
            </>
        )
    };

return (
    <ImageBackground
        source={FundoPoke}
        style={styles.background}
        resizeMode="cover"
    >
        <ScrollView contentContainerStyle={styles.scrollContainer}>

            <View style={styles.header}>
                <Text style={styles.text}>Sua Pokédex</Text>

            </View>


            <Card
                number="#133"
                name="Eevee"
                type="normal"
                pokemonImage={eevee}
                details={[TextMock.eevee]}
            />

              <Card
                number="#0134"
                name="Vaporeon"
                type="agua"
                pokemonImage={vaporeon}
                details={[TextMock.vaporeon]}
            />

            <Card
                number="#0135"
                name="Jolteon"
                type="eletrico"
                pokemonImage={jolteon}
                details={[TextMock.jolteon]}
            />

            <Card
                number="#0136"
                name="Flareon"
                type="fogo"
                pokemonImage={flarom}
                details={[TextMock.flarom]}
            />

            <Button title="Sair" onPress={signOut} />
        </ScrollView>
    </ImageBackground>
);
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        padding: 20,
        paddingTop: 60,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF'
    }
});