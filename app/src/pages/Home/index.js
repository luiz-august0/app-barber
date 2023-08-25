import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, BackHandler, Alert } from "react-native";
import style from "./style";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MAIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from "react-redux";
import { usuarioLogado } from "../../store/actions/usuario";
import { api, getBarbeirosByUsuario } from "../../services/api";
import Header from "../../components/Header";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = (props) => {
    const [barbeariaID, setBarbeariaID] = useState("");

    const getBarbeariaID = async() => {
        try {
            const res = await getBarbeirosByUsuario(props.usuario.state.id);
            setBarbeariaID(res.data[0].Barb_Codigo);
        } catch (error) {
            Alert.alert('Atenção', 'Ops, ocorreu algum erro ao consultar a barbearia vinculada ao seu usuário, contate o suporte');
        }
    }

    useEffect(() =>{
        if (props.usuario.state.tipo === "F") {
            getBarbeariaID();
        }

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

    const logout = async() => {
        await AsyncStorage.removeItem("usuario");
        await AsyncStorage.removeItem("token");
        
        api.defaults.headers.Authorization = null;
        props.navigation.navigate('Login');
    }

    const menuAvailable = () => {
        if (props.usuario.state.tipo === "B") {
            return (
                <TouchableOpacity
                style={style.button}
                onPress={() => props.navigation.navigate('UsuarioBarbearias')}
                >
                    <MIcon name="office-building" size={50} color={'#FDEBDD'}></MIcon>
                    <Text style={style.text}>MINHAS BARBEARIAS</Text>
                </TouchableOpacity>
            )
        } 
        else if (props.usuario.state.tipo === "C" || props.usuario.state.tipo === "F") {
            return (
                <>
                    {props.usuario.state.tipo === "C"?
                    <TouchableOpacity
                    style={style.button}
                    onPress={() => props.navigation.navigate('AgendamentoBarbearia')}
                    >
                        <MIcon name="calendar-cursor" size={50} color={'#FDEBDD'}></MIcon>
                        <Text style={style.text}>AGENDAR HORÁRIO</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                    style={style.button}
                    onPress={() => props.navigation.navigate("MenuBarbeiro", { barbeariaID: barbeariaID, barbeiroID: props.usuario.state.id})}
                    >
                        <MIcon name="account-details" size={50} color={'#FDEBDD'}></MIcon>
                        <Text style={style.text}>MENU DO BARBEIRO</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity
                    style={style.button}
                    onPress={() => props.navigation.navigate('Agendamentos')}
                    >
                        <MIcon name="calendar-month" size={50} color={'#FDEBDD'}></MIcon>
                        <Text style={style.text}>MEUS AGENDAMENTOS</Text>
                    </TouchableOpacity>
                </>
            )
        } 
    }

    return (
        <SafeAreaView style={style.container}>
            <ScrollView style={style.container}>
                <Header/>
                <View style={style.viewButtons}>
                    {menuAvailable()}
                    <TouchableOpacity
                    style={style.button}
                    onPress={() => props.navigation.navigate('Perfil')}
                    >
                        <MAIcon name="person" size={50} color={'#FDEBDD'}></MAIcon>
                        <Text style={style.text}>PERFIL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={style.button}
                    onPress={() => logout()}
                    >
                        <MIcon name="logout" size={50} color={'#FDEBDD'}></MIcon>
                        <Text style={style.text}>SAIR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
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