import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Card, Title, Paragraph } from 'react-native-paper';
import { getBarbeariasUsuario } from "../../services/api";
import globalFunction from "../../globalFunction";
import globalStyles from "../../globalStyles";
import style from "./style";
import { connect } from "react-redux";

const UsuarioBarbearias = (props) => {
    const [barbearias, setBarbearias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getUsuarioBarbearias = async() => {
        setIsLoading(true);
        try {
            const response = await getBarbeariasUsuario(props.usuario.state.id);
            console.log(props.usuario.state.id);
            setBarbearias(response.data);
        } catch (error) {
            Alert.alert("Ops!", "Ocorreu algum erro ao pesquisar as barbearias vinculadas ao seu usuário.");
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getUsuarioBarbearias();
    }, []);

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                <TouchableOpacity
                style={style.button}
                onPress={() => props.navigation.navigate('EdicaoBarbearia')}
                >
                    <Text style={style.text}>Cadastrar Nova Barbearia</Text>
                </TouchableOpacity>
                {JSON.stringify(barbearias) != "[]"?
                <Text style={style.textTitle}>Minhas Barbearias</Text>:null}
                {!isLoading?
                <>
                    {barbearias.map((e) => {
                        const cep = globalFunction.formataCampo(e.Barb_CEP, "00.000-000");
                        const cnpj = globalFunction.formataCampo(e.Barb_CNPJ, "00.000.000/0000-00");

                        return (
                        <Card key={e.Barb_Codigo} onPress={() => Alert.alert('Teste')} style={{width: 300, marginBottom: 25}}>
                            <Card.Cover source={{ uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Barb_LogoUrl}` }} />
                            <Card.Title title={e.Barb_Nome} 
                                        subtitle={`${e.Barb_Rua}, ${e.Barb_Numero} - ${e.Barb_Bairro}, ${e.Barb_Cidade} - ${e.Barb_UF}, ${cep} \nCNPJ: ${cnpj} \nIE: ${e.Barb_InscEst}`}
                                        titleNumberOfLines={0} 
                                        subtitleNumberOfLines={0}/>
                        </Card>
                        )
                    })}
                </>:<ActivityIndicator style={{marginTop: 50}}/>}
            </View>
        </ScrollView>
    )
}
    
const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}

export default connect(mapStateToProps, null)(UsuarioBarbearias);