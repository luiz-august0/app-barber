import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import style from "./style";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Context } from "../../contexts/auth";
import { usuarioLogado } from "../../store/actions/usuario";

const Home = (props) => {
    const { logout } = useContext(Context);

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