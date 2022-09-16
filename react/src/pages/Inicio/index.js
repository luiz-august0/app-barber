import React from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from './style'
import imgBarber from '../../img/barber.png';

const Inicio = ({ navigation, route }) => {
    const onClickButton = async (tipoUsuario) => {
        await AsyncStorage.setItem('@tipoUsuario', tipoUsuario);
        navigation.navigate('Login');
    }

    return (
    <View style={style.container}>
        <Image source={imgBarber} style={style.image}/>
        <Text style={style.text_title}>Barber</Text>
        <TouchableOpacity
        style={style.button1}
        onPress={() => onClickButton('b')}
        >
            <Text style={style.text}>Sou Barbeiro</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={style.button2}
        onPress={() => onClickButton('c')}
        >
            <Text style={style.text}>Sou Cliente</Text>
        </TouchableOpacity>
    </View>
    ) 
}

export default Inicio;