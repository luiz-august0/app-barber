import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, BackHandler, Alert } from "react-native";
import style from "./style";
import Header from "../../components/Header";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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

    useEffect(() =>{
        const backAction = () => {
            Alert.alert('Atenção', 'Deseja realmente sair do aplicativo?', [
                {
                    text: 'Cancelar',
                    onPress: () => null,
                    style: 'cancel',
                },
                {text: 'Sim', onPress: () => BackHandler.exitApp()},
            ]);
            return true;
        };
      
        const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
        );
      
        return () => backHandler.remove();
    }, []);

    const menuAvailable = () => {
        if (props.usuario.state.tipo === "B") {
            return (
                <TouchableOpacity
                style={style.button}
                onPress={() => props.navigation.navigate('UsuarioBarbearias')}
                >
                    <MIcon name="office-building" size={80} color={'#ffff'}></MIcon>
                    <Text style={style.text}>Minhas Barbearias</Text>
                </TouchableOpacity>
            )
        } 
        else if (props.usuario.state.tipo === "C") {
            return (
                <TouchableOpacity
                style={style.button}
                >
                    <MIcon name="calendar-week" size={80} color={'#ffff'}></MIcon>
                    <Text style={style.text}>Agendamentos</Text>
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={style.container}>
            <Header navigation={props.navigation} route={props.route}/>
            <View style={style.viewButtons}>
                {menuAvailable()}
                <TouchableOpacity
                style={style.button}
                onPress={() => logoutEvent()}
                >
                    <Text style={style.text}>Sair</Text>
                </TouchableOpacity>
            </View>
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