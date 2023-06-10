import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from "react-native";
import { Card } from 'react-native-paper';
import { getBarbeariasUsuario } from "../../services/api";
import globalFunction from "../../globalFunction";
import style from "./style";
import { connect } from "react-redux";
import Loading from "../../components/Loading";

const UsuarioBarbearias = (props) => {
    const [refresh, setRefresh] = useState(false);
    const [barbearias, setBarbearias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getUsuarioBarbearias = async() => {
        setIsLoading(true);
        try {
            const response = await getBarbeariasUsuario(props.usuario.state.id);
            setBarbearias(response.data);
        } catch (error) {
            Alert.alert('Atenção', "Ops!, Ocorreu algum erro ao pesquisar as barbearias vinculadas ao seu usuário.");
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getUsuarioBarbearias();
    }, []);

    if (isLoading) {
        return <Loading/>
    } else {
    return (
        <View style={style.container}>
            <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => getUsuarioBarbearias()}/>
                }>
                <TouchableOpacity
                style={style.button}
                onPress={() => props.navigation.navigate('DadosBarbearia')}
                >
                    <Text style={style.text}>Cadastrar Nova Barbearia</Text>
                </TouchableOpacity>
                {JSON.stringify(barbearias) != "[]"?
                <Text style={style.textTitle}>Minhas Barbearias</Text>:null}
                {barbearias.map((e) => {
                    const cep = globalFunction.formataCampo(e.Barb_CEP, "00.000-000");
                    const cnpj = globalFunction.formataCampo(e.Barb_CNPJ, "00.000.000/0000-00");

                    return (
                    <Card key={e.Barb_Codigo} onPress={() => props.navigation.navigate('MenuBarbearia', { barbeariaID: e.Barb_Codigo })} style={{width: 300, marginBottom: 25}}>
                        {e.Barb_LogoUrl!==null?
                        <Card.Cover resizeMode="cover" source={{ uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Barb_LogoUrl}` }} />
                        :null}
                        <Card.Title title={e.Barb_Nome} 
                                    subtitle={`${e.Barb_Rua}, ${e.Barb_Numero} - ${e.Barb_Bairro}, ${e.Barb_Cidade} - ${e.Barb_UF}, ${cep} \nCNPJ: ${cnpj} \nIE: ${e.Barb_InscEst}`}
                                    titleNumberOfLines={0} 
                                    subtitleNumberOfLines={0}/>
                    </Card>
                    )
                })}
            </ScrollView>
        </View>
    )}
}
    
const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}

export default connect(mapStateToProps, null)(UsuarioBarbearias);