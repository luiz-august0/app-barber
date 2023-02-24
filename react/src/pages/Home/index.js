import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import style from "./style";
import { logout } from  '../../contexts/auth';
import Header from "../../components/Header";
import globalStyles from "../../globalStyles";
import { connect } from "react-redux";
import { usuarioLogado } from "../../store/actions/usuario";

const Home = (props) => {
    const logoutEvent = () => {
        logout();
        props.onLogout();
        props.navigation.navigate('Login');
    }

    return (
        <View style={style.container}>
            <Header navigation={props.navigation} route={props.route}/>
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
    
const mapDispatchToProps = dispatch => {
    return {
        onLogout:() => dispatch(usuarioLogado(null))
    }
}

export default connect(null, mapDispatchToProps)(Home);