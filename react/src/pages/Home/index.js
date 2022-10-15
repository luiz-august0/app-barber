import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import style from "./style";
import { logout } from  '../../contexts/auth';
import img from '../../img/imgMenu.png';

const Home = ({navigation, route}) => {
    const logoutEvent = () => {
        logout();
        navigation.navigate('Login');
    }

    return (
    <View style={style.container}>
        <Image source={img} style={style.image}/>
        <TouchableOpacity
        style={style.button}
        >
            <Text style={style.text}>Agendamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={style.button}
        onPress={() => navigation.navigate('Perfil')}
        >
            <Text style={style.text}>Meu Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={style.button}
        onPress={() => logoutEvent()}
        >
            <Text style={style.text}>Sair</Text>
        </TouchableOpacity>
    </View>
    )
}
    
export default Home;