import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import style from "./style";
import globalStyles from "../../globalStyles";
import { getBarbeirosByBarbearia } from "../../services/api";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";

const Barbeiros = (props) => {
    const isFocused = useIsFocused();
    const [ barbeiros, setBarbeiros ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const getBarbeiros = async() => {
        setLoading(true);
        try {            
            const res = await getBarbeirosByBarbearia(props.route.params?.barbeariaID);
            setBarbeiros(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os barbeiros, contate o suporte");
        }
        setLoading(false);
    }

    const filterBarbeiroWithMyUser = () => {
        return barbeiros.some(e => e.Usr_Codigo == props.usuario.state.id);
    }

    useEffect(() => {
        if(isFocused) { 
            getBarbeiros();
        }
    }, [props, isFocused]);

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                <TouchableOpacity
                style={style.button}
                onPress={() => props.navigation.navigate("DadosBarbeiro", { barbeariaID: props.route.params?.barbeariaID })}
                >
                    <Text style={style.text}>Cadastrar Novo Barbeiro</Text>
                </TouchableOpacity>
                {JSON.stringify(barbeiros) !== "[]"?
                <Text style={style.textTitle}>Barbeiros</Text>:null}
                {!loading?
                <>
                    {!filterBarbeiroWithMyUser()?
                    <TouchableOpacity
                    style={style.button}
                    onPress={() => props.navigation.navigate("DadosBarbeiro", { barbeariaID: props.route.params?.barbeariaID })}>
                        <Text style={style.text}>Cadastrar Novo Barbeiro</Text>
                    </TouchableOpacity>:null}
                    {barbeiros.map((e) => {
                        return (
                            <View key={e.Usr_Codigo}>

                            </View>
                        )
                    })}
                </>:<ActivityIndicator style={{marginTop: '20%'}}/>}
            </View>
        </ScrollView>
    )
}

const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}
    
export default connect(mapStateToProps, null)(Barbeiros);