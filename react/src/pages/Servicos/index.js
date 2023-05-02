import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import style from "./style";
import globalStyles from "../../globalStyles";
import { getBarbeariaCategoriaServicos } from "../../services/api";
import { useIsFocused } from "@react-navigation/native";
import ServicoComponent from "../../components/ServicoComponent";

const Servicos = (props) => {
    const isFocused = useIsFocused();
    const [ servicos, setServicos ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const getServicos = async() => {
        setLoading(true);
        try {            
            const res = await getBarbeariaCategoriaServicos(props.route.params?.categoriaID);
            setServicos(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os serviços, contate o suporte");
        }
        setLoading(false);
    }

    useEffect(() => {
        if(isFocused) { 
            getServicos();
        }
    }, [props, isFocused]);

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                <TouchableOpacity
                style={style.button}
                onPress={() => props.navigation.navigate("DadosServico")}
                >
                    <Text style={style.text}>Cadastrar Novo Serviço</Text>
                </TouchableOpacity>
                {JSON.stringify(servicos) !== "[]"?
                <Text style={style.textTitle}>Serviços</Text>:null}
                {!loading?
                <>
                    {servicos.map((e) => {
                        return (
                            <View key={e.Serv_Codigo}>
                                <ServicoComponent 
                                props={props}
                                nome={e.Serv_Nome} 
                                valor={e.Serv_Valor} 
                                tempo={e.Minutos} 
                                id={e.Serv_Codigo} 
                                screenNavigation={'DadosServico'}
                                />
                            </View>
                        )
                    })}
                </>:<ActivityIndicator style={{marginTop: '20%'}}/>}
            </View>
        </ScrollView>
    )
}
    
export default Servicos;