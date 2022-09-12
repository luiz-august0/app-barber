import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, TextInput, View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import style from './style'

const Inicio = ({ navigation, route }) => {
    return (
    <View style={style.container}>
        <TouchableOpacity
        style={style.button}
        onPress={() => navigation.navigate('Login')}
        >
            <Text style={style.text}>Sou Barbeiro</Text>
        </TouchableOpacity>
    </View>
    ) 
}

export default Inicio;