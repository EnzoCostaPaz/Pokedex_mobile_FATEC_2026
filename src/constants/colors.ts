import { ImageBackground } from "react-native";

export const Colors ={
  semantic: {
        error: {
            bg: '#FFEBEE',
            border: '#B71C1C',
            text: '#B71C1C'
        },
        success: {
            bg: '#E8F5E9',
            border: '#1B5E20',
            text: '#1B5E20'
        },
        warning: {
            bg: '#FFF8E1',
            border: '#FF8F00',
            text: '#FF8F00'
        },
        info: {
            bg: '#E3F2FD',
            border: '#2196F3',
            text: '#0D47A1'
        }
    },
} as const;