import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView } from "react-native";
import style from "./style";
import { logout } from  '../../contexts/auth';
import Header from "../../components/Header";

const Home = ({navigation, route}) => {
    const logoutEvent = () => {
        logout();
        navigation.navigate('Login');
    }

    return (
    <View style={style.container}>
        <Header navigation={navigation} route={route}/>
        <TouchableOpacity
        style={style.button}
        >
        <Text style={style.text}>Agendamentos</Text>
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