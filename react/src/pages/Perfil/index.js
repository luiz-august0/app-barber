import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import style from "./style";
import { getUsuario } from "../../services/api";
import img from '../../img/imgMenu.png';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Perfil = ({navigation, route}) => {
    const [dataUsuario, setDataUsuario] = useState([]);

    const getUsuarioData = async () => {
        const response = getUsuario(JSON.parse(await AsyncStorage.getItem('usuario')).id);
        setDataUsuario((await response).data);
    }

    useEffect(() => {
        getUsuarioData();
    }, []);

    return (
    <View style={style.container}>
        {dataUsuario.map((result) => {
            return (
                <View key={result.Usr_Codigo} style={{marginTop: '30%'}}>
                    <Text style={style.textTitle}>Dados do Usuário</Text>
                    <Text style={[style.text, {marginTop: '10%'}]}>EMAIL - {result.Usr_Email}</Text>
                    <Text style={[style.text]}>NOME - {result.Usr_Nome}</Text>
                    <Text style={[style.text]}>CONTATO - {result.Usr_Contato}</Text>
                    <Text style={[style.text]}>CPF - {result.Usr_CPF}</Text>
                </View>
            )
        })}
    </View>
    )
}
    
export default Perfil;