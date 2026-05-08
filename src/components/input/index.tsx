import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { styles } from "./styles";

type InputProps = TextInputProps & {
    
};

export function Input({ ...rest }: InputProps) {
    return (
        <TextInput 
            style={styles.input_web}
            {...rest}
        />
    );
}
