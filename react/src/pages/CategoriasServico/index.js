import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import style from "./style";
import globalStyles from "../../globalStyles";
import { HelperText, TextInput } from "react-native-paper";
import AbsoluteModal from "../../components/AbsoluteModal";
import { postBarbeariaCategoria } from "../../services/api";

const CategoriasServico = (props) => {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ loadingResponse, setLoadingResponse] = useState(false);
    const [ nome, setNome ] = useState('');
    const [ errors, setErrors ] = useState({ 'nome': null });
    const [ idInEdit, setIdInEdit ] = useState(null);

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const handleSubmitCategoria = () => {
        const postCategoria = async() => {
            if (idInEdit !== null) {

            } else {
                setLoadingResponse(true);
                try {
                    await postBarbeariaCategoria(props.route.params?.barbeariaID, nome);
                    setModalVisible(false);
                    Alert.alert("Atenção", "Categoria cadastrada com sucesso");
                } catch (error) {
                    if (error.message = "Request failed with status code 401") {
                        handleError('Nome informado já cadastrado', 'nome');
                    }
                    console.log(error);
                }
                setLoadingResponse(false);
            }
        }

        if (nome == '') {
            handleError('Nome deve ser informado', 'nome');
        } else {
            postCategoria();
        }
    }

    useEffect(() => {

    }, []);
    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                <TouchableOpacity
                style={style.button}
                onPress={() => setModalVisible(true)}
                >
                    <Text style={style.text}>Cadastrar Nova Categoria</Text>
                </TouchableOpacity>
                <AbsoluteModal modalVisible={modalVisible} width={350}>
                    <TextInput
                    style={style.input}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    label="Nome"
                    error={errors.nome !== null ? true : false}
                    onFocus={() => handleError(null, 'nome')}
                    theme={{ colors: { placeholder: `${nome!==null&&nome!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                    value={nome}
                    onChangeText={(nome) => setNome(nome)}
                    />
                    <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.nome !== null ? true : false}>
                        {errors.nome}
                    </HelperText>
                    <TouchableOpacity style={[style.buttonConfirma, { backgroundColor: !loadingResponse?'#05A94E':'gray' }]} onPress={() => {!loadingResponse?handleSubmitCategoria():null}}>
                        {!loadingResponse?<Text style={{ color: '#fff', fontWeight: 'bold'}}>Confirmar</Text>
                        :<ActivityIndicator/>}
                        </TouchableOpacity>
                        {!loadingResponse?
                        <TouchableOpacity style={[style.buttonConfirma, { backgroundColor: '#E82E2E' }]} onPress={() => {}}>
                        {!loadingResponse?<Text style={{ color: '#fff', fontWeight: 'bold'}}>Cancelar</Text>
                        :<ActivityIndicator/>}
                    </TouchableOpacity>:null}
                </AbsoluteModal>
            </View>
        </ScrollView>
    )
}
    
export default CategoriasServico;