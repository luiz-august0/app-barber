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

    const menuAvailable = () => {
        if (props.usuario.state.tipo = "B") {
            return (
                <TouchableOpacity
                style={style.button}
                onPress={() => props.navigation.navigate('UsuarioBarbearias')}
                >
                    <Text style={style.text}>Minhas Barbearias</Text>
                </TouchableOpacity>
            )
        } 
        else if (props.usuario.state.tipo = "C") {
            return (
                <TouchableOpacity
                style={style.button}
                >
                    <Text style={style.text}>Agendamentos</Text>
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={style.container}>
            <Header navigation={props.navigation} route={props.route}/>
            {menuAvailable()}
            <TouchableOpacity
            style={style.button}
            onPress={() => logoutEvent()}
            >
                <Text style={style.text}>Sair</Text>
            </TouchableOpacity>
        </View>
    )
}
    
const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout:() => dispatch(usuarioLogado(null))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);