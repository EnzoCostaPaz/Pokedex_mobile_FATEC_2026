import React from "react";
import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

interface LogoProps{
    name: React.FC<SvgProps>;
    size?: number;
    color?: string;
    style?: ViewStyle;
}

export function Logo({name: LogoComponent, size= 50, color, style}: LogoProps){
    return(
        <View style={[ { alignItems: 'center', justifyContent: 'center', width: size, height: size }, style]}>
            <LogoComponent 
            width={size} 
            height={size} 
            fill={color} />
        </View>
    )
}

