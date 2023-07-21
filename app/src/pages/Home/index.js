import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, BackHandler, Alert } from "react-native";
import style from "./style";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";
import { usuarioLogado } from "../../store/actions/usuario";

const Home = (props) => {
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
                    <MIcon name="office-building" size={80} color={'#BA6213'}></MIcon>
                    <Text style={style.text}>MINHAS BARBEARIAS</Text>
                </TouchableOpacity>
            )
        } 
        else if (props.usuario.state.tipo === "C") {
            return (
                <>
                    <TouchableOpacity
                    style={style.button}
                    onPress={() => props.navigation.navigate('AgendamentoBarbearia')}
                    >
                        <MIcon name="calendar-cursor" size={80} color={'#BA6213'}></MIcon>
                        <Text style={style.text}>AGENDAR HORÁRIO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={style.button}
                    onPress={() => props.navigation.navigate('Agendamentos')}
                    >
                        <MIcon name="calendar-month" size={80} color={'#BA6213'}></MIcon>
                        <Text style={style.text}>MEUS AGENDAMENTOS</Text>
                    </TouchableOpacity>
                </>
            )
        }
    }

    return (
        <View style={style.container}>
            <View style={style.viewButtons}>
                {menuAvailable()}
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