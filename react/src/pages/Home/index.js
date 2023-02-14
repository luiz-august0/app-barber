import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import style from "./style";
import { logout } from  '../../contexts/auth';
import Header from "../../components/Header";
import globalStyles from "../../globalStyles";

const Home = ({navigation, route}) => {
    const logoutEvent = () => {
        logout();
        navigation.navigate('Login');
    }

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
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
        </ScrollView>
    )
}
    
export default Home;