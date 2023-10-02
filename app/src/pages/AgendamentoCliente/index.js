import React, { useState } from "react";
import { ScrollView, SafeAreaView, Text, View, Alert, Image, TouchableOpacity } from "react-native";
import style from "./style";
import perfil from "../../img/perfil.png";
import { TextInput } from "react-native-paper";
import { getUsuarioClienteByNome } from "../../services/api";
import globalFunction from '../../globalFunction';

const AgendamentoCliente = (props) => {
    const [refresh, setRefresh] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [nome, setNome] = useState("");

    const getClientes = async() => {
        if (nome == "") {
            setRefresh(false);
            setClientes([]);
            return;
        }

        setRefresh(true);
        try {
            const res = await getUsuarioClienteByNome(nome.toUpperCase());
            setClientes(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, ocorreu um erro ao carregar os clientes, contate o suporte");
        }
        setRefresh(false);
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity key={item.Usr_Codigo} style={style.renderItemCliente} onPress={() => props.navigation.navigate("AgendamentoServico", { barbeariaID: props.route.params?.barbeariaID, usuarioID: item.Usr_Codigo })}>
                {item.Usr_FotoPerfil!==null&&item.Usr_FotoPerfil!==""?
                <Image style={style.image} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${item.Usr_FotoPerfil}`}}/>
                :<Image style={style.image} source={perfil}/>}
                <View style={{flex:1, padding: 10}}>
                    <Text style={style.textTitleCliente}>{item.Usr_Nome}</Text>
                    <Text style={style.textSubtitleCliente}>{item.Usr_Email}</Text>      
                    {item.Usr_Contato!==""&&item.Usr_Contato!==null?<Text style={style.textSubtitleCliente}>{globalFunction.formataTelefone(item.Usr_Contato)}</Text>:null}
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={style.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={style.textTitle}>SELECIONE UM CLIENTE</Text>
                <View style={style.headerView}>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#BA6213'
                    label="Digite o nome do cliente"
                    value={nome}
                    theme={{ colors: { placeholder: "#BA6213", text: '#BA6213', primary: '#BA6213' } }}
                    left={<TextInput.Icon color="#BA6213" name="magnify"/>}
                    onChangeText={(nome) => setNome(nome)}
                    onBlur={() => getClientes()}
                    />
                </View>
                <View style={{padding: 10}}>
                    {JSON.stringify(clientes) !== "[]"?
                    <>   
                        {clientes.map((e) => renderItem(e))}
                    </>
                    :<Text style={[style.textSubTitle, { textAlign: 'center' }]}>{refresh?"Carregando clientes...":"Não há clientes para mostrar"}</Text>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
    
export default AgendamentoCliente;