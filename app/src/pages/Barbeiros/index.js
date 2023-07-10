import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, SafeAreaView, RefreshControl } from "react-native";
import style from "./style";
import { deleteBarbeiro, deleteUsuario, getBarbeirosByBarbearia, postBarbeiro } from "../../services/api";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import perfil from "../../img/perfil.png";
import globalFunction from "../../globalFunction";
import AbsoluteModal from "../../components/AbsoluteModal";
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import { TextInput } from "react-native-paper";

const Barbeiros = (props) => {
    const isFocused = useIsFocused();
    const [ barbeiros, setBarbeiros ] = useState([]);
    const [ especialidade, setEspecialidade ] = useState('');
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ loadingResponse, setLoadingResponse ] = useState(false);
    const [ refresh, setRefresh ] = useState(false);
 
    const getBarbeiros = async() => {
        setRefresh(true);
        try {            
            const res = await getBarbeirosByBarbearia(props.route.params?.barbeariaID);
            setBarbeiros(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os barbeiros, contate o suporte");
        }
        setRefresh(false);
    }

    const filterBarbeiroWithMyUser = () => {
        return barbeiros.some(e => e.Usr_Codigo == props.usuario.state.id);
    }

    const handleSubmitBarbeiro = async() => {
        setLoadingResponse(true);
        try {
            await postBarbeiro(props.route.params?.barbeariaID, props.usuario.state.id, especialidade);
            Alert.alert("Atenção", "Barbeiro cadastrado com sucesso");
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu algum erro ao confirmar, contate o suporte");
        }
        setLoadingResponse(false);
        setModalVisible(false);
        setEspecialidade("");
        getBarbeiros();
    }

    const handleDeleteBarbeiro = (id, tipo) => {
        const deleteRegister = async() => {
            try {
                await deleteBarbeiro(props.route.params?.barbeariaID, id);
                if (tipo !== 'B') {
                    await deleteUsuario(id);
                }
                Alert.alert('Atenção', 'Barbeiro excluído com sucesso');
                getBarbeiros();
            } catch (error) {
                if (error.message === "Request failed with status code 401") {
                    Alert.alert('Atenção', 'Não foi possível excluir o barbeiro pois há agendamentos que ainda irão ocorrer com este barbeiro');
                }
            }
        }

        Alert.alert('Confirmação', 'Deseja realmente excluir ?',
		[
			{text: 'Não', style: 'cancel'},
			{text: 'Sim', onPress: () => deleteRegister()},
		],
		{ cancelable: true });
    }

    const handlePressOut = () => {
        setModalVisible(false);
        setEspecialidade("");
    }

    useEffect(() => {
        if(isFocused) { 
            getBarbeiros();
        }
    }, [props, isFocused]);

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
				showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getBarbeiros()}/> }
            >
                <View style={{alignItems: "center"}}>
                    <TouchableOpacity
                        style={style.button}
                        onPress={() => props.navigation.navigate("DadosBarbeiro", { barbeariaID: props.route.params?.barbeariaID })}
                    >
                        <Text style={[style.text, { color: '#ffff' }]}>CADASTRAR NOVO BARBEIRO</Text>
                    </TouchableOpacity>
                    {!filterBarbeiroWithMyUser()?
                    <TouchableOpacity style={style.buttonAdd} onPress={() => setModalVisible(true)}>
                        <MIcon style={{padding: 10}} name="add-circle-outline" size={50} color={'#2B513B'}></MIcon>
                        <Text style={style.textButtonAdd}>Adicionar meu usuário como barbeiro</Text>
                    </TouchableOpacity>:null}
                    {JSON.stringify(barbeiros) !== "[]"?
                    <Text style={style.textTitle}>BARBEIROS</Text>:null}
                    {barbeiros.map((e) => {
                        return (
                            <View style={style.viewComponentBarbeiro} key={e.Usr_Codigo}>
                                <View style={{flexDirection: "row"}}>
                                    <Image 
                                    style={style.image}
                                    source={e.Usr_FotoPerfil !== null && e.Usr_FotoPerfil !== undefined && e.Usr_FotoPerfil !== ""?
                                    {uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Usr_FotoPerfil}`}:perfil}/>
                                    <View style={style.viewBarbeiro}>
                                        {e.Usr_Codigo !== props.usuario.state.id?
                                        <>
                                            <Text style={style.textDetails}>{`Nome: ${e.Usr_Nome}`}</Text>
                                            <Text style={style.textDetails}>{`Email: ${e.Usr_Email}`}</Text>
                                            <Text style={style.textDetails}>{`CPF: ${globalFunction.formataCPF(e.Usr_CPF)}`}</Text>
                                            {e.Usr_Contato !== null && e.Usr_Contato !== undefined && e.Usr_Contato !== ""?
                                            <Text style={style.textDetails}>{`Telefone: ${e.Usr_Contato}`}</Text>:null}
                                            {e.BarbB_Especialidade !== null && e.BarbB_Especialidade !== undefined && e.BarbB_Especialidade !== ""?
                                            <Text style={style.textDetails}>{`Especialidade: ${e.BarbB_Especialidade}`}</Text>:null}
                                        </>:<Text style={[style.textDetails, {width: '100%'}]}>Eu</Text>}
                                    </View>
                                </View>
                                <View style={style.buttonComponent}>
                                    <TouchableOpacity onPress={() => handleDeleteBarbeiro(e.Usr_Codigo, e.Usr_Tipo)}>
                                        <Text style={[style.text, {fontSize: 14}]}>Excluir</Text>
                                        <MIcon style={{marginHorizontal: 50}} name="delete" size={35} color={'#71150D'}></MIcon>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => props.navigation.navigate("MenuBarbeiro", { barbeariaID: props.route.params?.barbeariaID, barbeiroID: e.Usr_Codigo})}>
                                        <Text style={[style.text, {fontSize: 14}]}>Ir ao menu</Text>
                                        <MIcon style={{marginHorizontal: 50}} name="arrow-forward" size={35} color={'#2B513B'}></MIcon>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })}
                    <View style={{marginTop: 80}}></View>
                </View>
            </ScrollView>
            <AbsoluteModal handlePressOut={handlePressOut} modalVisible={modalVisible} width={'90%'}>
                <TextInput
                style={style.input}
                mode='flat'
                activeOutlineColor='#FFCA9F'
                label="Especialidade"
                theme={{ colors: { placeholder: `${especialidade!==null&&especialidade!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                left={<TextInput.Icon color="#FFCA9F" name="account" />}
                value={especialidade}
                onChangeText={(especialidade) => setEspecialidade(especialidade)}
                />
                <TouchableOpacity style={style.buttonConfirma} onPress={() => {!loadingResponse?handleSubmitBarbeiro():null}}>
                    {!loadingResponse?<Text style={{ color: '#FFCA9F', fontFamily: 'Manrope-Regular'}}>CONFIRMAR</Text>
                    :<ActivityIndicator/>}
                </TouchableOpacity>
            </AbsoluteModal>
        </SafeAreaView>
    )
}

const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}
    
export default connect(mapStateToProps, null)(Barbeiros);