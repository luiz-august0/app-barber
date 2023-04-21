import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import style from "./style";
import globalStyles from "../../globalStyles";
import { HelperText, TextInput } from "react-native-paper";
import AbsoluteModal from "../../components/AbsoluteModal";
import { deleteBarbeariaCategoria, getBarbeariaCategorias, postBarbeariaCategoria, updateBarbeariaCategoria } from "../../services/api";
import { useIsFocused } from "@react-navigation/native";

const CategoriasServico = (props) => {
    const isFocused = useIsFocused();
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ loadingResponse, setLoadingResponse] = useState(false);
    const [ nome, setNome ] = useState('');
    const [ errors, setErrors ] = useState({ 'nome': null });
    const [ idInEdit, setIdInEdit ] = useState(null);
    const [ categorias, setCategorias ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const getCategorias = async() => {
        setLoading(true);
        try {            
            const res = await getBarbeariaCategorias(props.route.params?.barbeariaID);
            setCategorias(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar as categorias, contate o suporte");
        }
        setLoading(false);
    }

    const handleSubmitCategoria = () => {
        const postCategoria = async() => {

            const refreshState = () => {
                setModalVisible(false);
                getCategorias();
                setIdInEdit(null);
                setNome('');
                handleError(null, 'nome');
            }

            setLoadingResponse(true);
            try {
                if (idInEdit !== null) {
                    await updateBarbeariaCategoria(idInEdit, props.route.params?.barbeariaID, nome);
                    Alert.alert("Atenção", "Categoria atualizada com sucesso");
                } else {
                    await postBarbeariaCategoria(props.route.params?.barbeariaID, nome);
                    Alert.alert("Atenção", "Categoria cadastrada com sucesso");
                }
                refreshState();
            } catch (error) {
                if (error.message = "Request failed with status code 401") {
                    handleError('Nome informado já cadastrado', 'nome');
                }
                console.log(error);
            }
            setLoadingResponse(false);
        }

        if (nome == '') {
            handleError('Nome deve ser informado', 'nome');
        } else {
            postCategoria();
        }
    }

    const handleDeleteCategoria = (id) => {
        const deleteRegister = async() => {
            try {
                await deleteBarbeariaCategoria(id);
                Alert.alert("Atenção", "Categoria excluida com sucesso")
            } catch (error) {
                if (error.message = "Request failed with status code 401") {
                    Alert.alert("Atenção", "Não foi possível excluir a categoria pois existe serviços vinculados a esta categoria")
                }
            }
            getCategorias();
        }

        Alert.alert('Confirmação', 'Deseja realmente excluir ?',
		[
			{text: 'Não', style: 'cancel'},
			{text: 'Sim', onPress: () => deleteRegister()},
		],
		{ cancelable: true });
    }

    useEffect(() => {
        if(isFocused) { 
            getCategorias();
        }
    }, [props, isFocused]);

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
                        <TouchableOpacity style={[style.buttonConfirma, { backgroundColor: '#E82E2E' }]} onPress={() => {
                            setIdInEdit(null);
                            setNome('');
                            setModalVisible(false);
                            handleError(null, 'nome');
                        }}>
                        {!loadingResponse?<Text style={{ color: '#fff', fontWeight: 'bold'}}>Cancelar</Text>
                        :<ActivityIndicator/>}
                    </TouchableOpacity>:null}
                </AbsoluteModal>
                {JSON.stringify(categorias) !== "[]"?
                <>
                    {!loading?
                    <>
                        <Text style={style.textTitle}>Categorias</Text>
                        {categorias.map((e) => {
                            return (
                                <View key={e.ServCat_Codigo} style={style.categoriaComponent}>
                                    <View style={style.categoriaView}>
                                        <View style={{width: '60%'}}>
                                            <Text style={style.textCategoria} >{e.ServCat_Nome}</Text>
                                        </View>
                                        <View style={style.categoriaViewButtons}>
                                            <TouchableOpacity style={style.buttonCategoriaComponent} onPress={() => {
                                                setIdInEdit(e.ServCat_Codigo);
                                                setNome(e.ServCat_Nome);
                                                setModalVisible(true);
                                            }}>
                                                <Text style={style.textCategoriaButton}>Editar</Text>
                                                <MIcon name="edit" size={25} color={'#e65c00'}></MIcon>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={style.buttonCategoriaComponent} onPress={() => handleDeleteCategoria(e.ServCat_Codigo)}>
                                                <Text style={style.textCategoriaButton}>Excluir</Text>
                                                <MIcon name="delete" size={25} color={'red'}></MIcon>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={style.buttonCategoriaComponent}>
                                                <Text style={style.textCategoriaButton}>Ver Serviços</Text>
                                                <MIcon name="arrow-forward" size={25} color={'#05A94E'}></MIcon>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </>
                    :<ActivityIndicator style={{marginTop: '20%'}}/>}
                </>
                :null}
            </View>
        </ScrollView>
    )
}
    
export default CategoriasServico;