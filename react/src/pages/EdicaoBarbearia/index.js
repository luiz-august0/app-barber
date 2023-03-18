import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Image } from "react-native";
import { Card, TextInput, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { connect } from "react-redux";
import { getDadosBarbearia, getDadosCEP } from "../../services/api";
import globalFunction from "../../globalFunction";
import globalStyles from "../../globalStyles";
import style from "./style";
import perfil from "../../img/perfil.png";

const EdicaoBarbearia = (props) => {
    const [image, setImage] = useState(null);
    const [state, setState] = useState({
        'nome': null, 'razao': null, 'cnpj': null, 'inscEstadual': null, 'cidade': null, 
        'cep': null, 'uf': null, 'rua': null, 'numero': null, 'bairro': null, 
        'complemento': null, 'latitude': null, 'longitude': null, 'descricao': null, 
        'contato': null
    });
    const [errors, setErrors] = useState({ 
        'nome': null, 'razao': null, 'cnpj': null, 'inscEstadual': null, 'cidade': null, 
        'cep': null, 'uf': null, 'rua': null, 'numero': null, 'bairro': null, 
        'complemento': null, 'latitude': null, 'longitude': null, 'descricao': null, 
        'contato': null 
    });
    const [contatos, setContatos] = useState([]);
    const [insertContatoMode, setInsertContatoMode] = useState(false);
    const [editContatoMode, setEditContatoMode] = useState(false);
    const [contatoInEdit, setContatoInEdit] = useState('');
    const [loadingLogo, setLoadingLogo] = useState(false);

    const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const getDataBarbearia = async(id) => {
        try {
            const response = await getDadosBarbearia(id);
            if (response.data[0].Barb_LogoUrl !== '') {
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${response.data[0].Barb_LogoUrl}`})
            } else {
                setImage(perfil);
            }
        } catch (error) {
            
        }
    }

    const pickImage = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
            quality: 1,
        })
        
        if (!res.cancelled) {
            const file = `data:${res.type}/jpeg;base64,${res.base64}`;

            try {
                setLoading(true);
                const responseImage = await updateUsuarioFoto(props.usuario.state.id, file);
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.base64});
                updateStoreUsuario();
                setLoading(false);
            } catch (error) {
                Alert.alert('Ops!, ocorreu algum erro ao realizar o upload da imagem.' )
                setLoading(false);
            }
        }
        
    }

    const updateIDContato = (contatos) => {
        let newArrayContatos = [];
        let i = 0;
        contatos.map((e) => {
            newArrayContatos.push({idContato: i, descricao: e.descricao, contato: e.contato});
            i = i + 1;
        });
        setContatos(newArrayContatos);
    }

    const handleDeleteContato = (id) => {
        let newArrayContatos = [];
        contatos.map((e) => {
            if (e.idContato !== id) {
                newArrayContatos.push({idContato: e.idContato, descricao: e.descricao, contato: e.contato});
            }
        });
        setContatos(newArrayContatos);
        updateIDContato(newArrayContatos);
    }

    const handleSubmitContato = () => {
        const validFields = () => {
            let isValid = true;

            contatos.map((e) => {
                if (state.contato === '' || state.contato === null) {
                    isValid = false;
                    handleError("Número de contato deve ser informado", "contato");
                }

                if (state.descricao === '') {
                    isValid = false;
                    handleError("Descrição do contato deve ser informada", "descricao"); 
                }

                if (state.contato !== '' && state.contato !== null) {
                    if (state.contato.length < 11 || state.contato.length > 11) {
                        isValid = false;
                        handleError("Número de contato inválido", "contato");
                    }
                }
    
                if (contatoInEdit !== '') {
                    if ((e.contato === state.contato) && (e.idContato !== contatoInEdit)) {
                        isValid = false;
                        handleError('Contato informado já existente', 'contato');
                    }
                } else {
                    if (e.contato === state.contato) {
                        isValid = false;
                        handleError('Contato informado já existente', 'contato');
                    }
                }
            })

            return isValid;
        }

        if (validFields()) { 
            let newArrayContatos = [];

            if (contatoInEdit !== '') {
                newArrayContatos = contatos.map(e => {
                    if (e.idContato === contatoInEdit) return {idContato: contatoInEdit, descricao: state.descricao, contato: state.contato};
                    return e;
                });
                setContatos(newArrayContatos);
            } else {
                contatos.map((e) => {
                    newArrayContatos.push({idContato: e.idContato, descricao: e.descricao, contato: e.contato});
                }); 
                newArrayContatos.push({idContato: contatos.length + 1, descricao: state.descricao, contato: state.contato});
                updateIDContato(newArrayContatos);
            }
            
            setEditContatoMode(false);
            setInsertContatoMode(false); 
            setValueState('contato', '');
            setValueState('descricao', '');
            handleError(null, 'contato');
            handleError(null, 'descricao');
            setContatoInEdit('');
        }
    }

    useEffect(() => {
        if(props.route.params?.barbeariaID != null) {
            getDataBarbearia(props.route.params?.barbeariaID);
        } else {
            setImage(perfil);
        }
    }, []);

    const handleSubmit = () => {
        let isValid = true;
    }

    const onFocusCEP = () => {
        setValueState('rua', null);
        setValueState('complemento', null);
        setValueState('bairro', null);
        setValueState('cidade', null);
        setValueState('uf', null);
        handleError(null, 'cep');
    }

    const consultaCEP = async() => {
        const cep = globalFunction.formataCampo(state.cep, "00000000");

        if (cep.length !== 8) {
            handleError("CEP inválido", "cep");
            return;
        }

        try {            
            const response = await getDadosCEP(cep);
            if (response.data.logradouro !== "") {
                setValueState('rua', response.data.logradouro);
            }
            if (response.data.complemento !== "") {
                setValueState('complemento', response.data.complemento);
            }
            if (response.data.bairro !== "") {
                setValueState('bairro', response.data.bairro);
            }
            if (response.data.localidade !== "") {
                setValueState('cidade', response.data.localidade);
            }
            if (response.data.uf !== "") {
                setValueState('uf', response.data.uf);
            }
        } catch (error) {
            console.log(error);
            setValueState('rua', null);
            setValueState('complemento', null);
            setValueState('bairro', null);
            setValueState('cidade', null);
            setValueState('uf', null);
        }
    }

    const addEditContato = () => {
        return (
            <>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    label="Descrição"
                    error={errors.descricao !== null ? true : false}
                    onFocus={() => handleError(null, 'descricao')}
                    theme={{ colors: { placeholder: `${state.descricao!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                    value={state.descricao}
                    onChangeText={(descricao) => setValueState('descricao', descricao)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.descricao !== null ? true : false}>
                    {errors.descricao}
                </HelperText>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    label="Contato"
                    keyboardType="number-pad"
                    error={errors.contato !== null ? true : false}
                    onFocus={() => handleError(null, 'contato')}
                    theme={{ colors: { placeholder: `${state.contato!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                    value={state.contato}
                    onChangeText={(contato) => setValueState('contato', contato)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.contato !== null ? true : false}>
                    {errors.contato}
                </HelperText>
                <TouchableOpacity style={[style.button, {backgroundColor: '#05A94E', marginBottom: 10}]} onPress={() => handleSubmitContato()}>
                    <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.button, {backgroundColor: '#E82E2E', marginTop: 0}]} onPress={() => {
                    setEditContatoMode(false);
                    setInsertContatoMode(false); 
                    setValueState('contato', '');
                    setValueState('descricao', '');
                    setContatoInEdit('');
                    }}>
                    <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Cancelar</Text>
                </TouchableOpacity>
            </>
        )
    }

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
            {loadingLogo?
                <View style={[style.containerIndicator, style.horizontalIndicator]}>
                    <ActivityIndicator/>
                </View>:
                <View style={style.imageContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <Image source={image} style={style.image}/>
                </TouchableOpacity>
                </View>
            }
            <Text style={style.textSubtitle}>Clique na imagem para mudar a logo da barbearia</Text>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="Nome"
                error={errors.nome !== null ? true : false}
                onFocus={() => handleError(null, 'nome')}
                theme={{ colors: { placeholder: `${state.nome!==null?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.nome}
                onChangeText={(nome) => setValueState('nome', nome)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.nome !== null ? true : false}>
                    {errors.nome}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="Razão Social"
                error={errors.razao !== null ? true : false}
                onFocus={() => handleError(null, 'razao')}
                theme={{ colors: { placeholder: `${state.razao!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.razao}
                onChangeText={(razao) => setValueState('razao', razao)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.razao !== null ? true : false}>
                    {errors.razao}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="CNPJ"
                keyboardType="number-pad"
                error={errors.cnpj !== null ? true : false}
                onFocus={() => handleError(null, 'cnpj')}
                theme={{ colors: { placeholder: `${state.cnpj!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={globalFunction.formataCampo(state.cnpj, "00.000.000/0000-00")}
                onChangeText={(cnpj) => setValueState('cnpj', globalFunction.formataCampo(cnpj, "00.000.000/0000-00"))}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.cnpj !== null ? true : false}>
                    {errors.cnpj}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="IE"
                keyboardType="number-pad"
                error={errors.inscEstadual !== null ? true : false}
                onFocus={() => handleError(null, 'inscEstadual')}
                theme={{ colors: { placeholder: `${state.inscEstadual!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.inscEstadual}
                onChangeText={(inscEstadual) => setValueState('inscEstadual', inscEstadual)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.inscEstadual !== null ? true : false}>
                    {errors.inscEstadual}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="CEP"
                keyboardType="number-pad"
                error={errors.cep !== null ? true : false}
                onFocus={() => onFocusCEP()}
                onEndEditing={() => consultaCEP()}
                theme={{ colors: { placeholder: `${state.cep!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={globalFunction.formataCampo(state.cep, "00.000-000")}
                onChangeText={(cep) => setValueState('cep', globalFunction.formataCampo(cep, "00.000-000"))}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.cep !== null ? true : false}>
                    {errors.cep}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="Cidade"
                error={errors.cidade !== null ? true : false}
                onFocus={() => handleError(null, 'cidade')}
                theme={{ colors: { placeholder: `${state.cidade!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.cidade}
                onChangeText={(cidade) => setValueState('cidade', cidade)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.cidade !== null ? true : false}>
                    {errors.cidade}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="UF"
                error={errors.uf !== null ? true : false}
                onFocus={() => handleError(null, 'uf')}
                theme={{ colors: { placeholder: `${state.uf!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.uf}
                onChangeText={(uf) => setValueState('uf', uf)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.uf !== null ? true : false}>
                    {errors.uf}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="Rua"
                error={errors.rua !== null ? true : false}
                onFocus={() => handleError(null, 'rua')}
                theme={{ colors: { placeholder: `${state.rua!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.rua}
                onChangeText={(rua) => setValueState('rua', rua)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.rua !== null ? true : false}>
                    {errors.rua}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="Número"
                keyboardType="number-pad"
                error={errors.numero !== null ? true : false}
                onFocus={() => handleError(null, 'numero')}
                theme={{ colors: { placeholder: `${state.numero!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.numero}
                onChangeText={(numero) => setValueState('numero', numero)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.numero !== null ? true : false}>
                    {errors.numero}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="Bairro"
                error={errors.bairro !== null ? true : false}
                onFocus={() => handleError(null, 'bairro')}
                theme={{ colors: { placeholder: `${state.bairro!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.bairro}
                onChangeText={(bairro) => setValueState('bairro', bairro)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.bairro !== null ? true : false}>
                    {errors.bairro}
                </HelperText>
                <TextInput
                style={style.input}
                mode='outlined'
                activeOutlineColor='#fff'
                label="Complemento"
                error={errors.complemento !== null ? true : false}
                onFocus={() => handleError(null, 'complemento')}
                theme={{ colors: { placeholder: `${state.complemento!==null?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={state.complemento}
                onChangeText={(complemento) => setValueState('complemento', complemento)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.complemento !== null ? true : false}>
                    {errors.complemento}
                </HelperText>
                <Text style={style.textTitle}>Contatos</Text>    
                <TouchableOpacity onPress={() => {
                    setEditContatoMode(false); 
                    setInsertContatoMode(false); 
                    setContatoInEdit('');
                    setValueState('contato', '');
                    setValueState('descricao', '');
                    handleError(null, 'contato');
                    handleError(null, 'descricao');
                    setInsertContatoMode(true);
                    }}>
                    <Text style={[style.textButtom, { color: '#05A94E', fontSize: 16 }]}>Adicionar</Text>
                </TouchableOpacity>
                {insertContatoMode?addEditContato():null}
                {contatos.map((e) => {
                    return (
                        <Card key={e.idContato} style={{width: 300, marginBottom: 10, backgroundColor: '#FFB337'}}>
                        <Card.Title title={`${e.descricao}: ${e.contato}`}
                                    titleNumberOfLines={0}/>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => handleDeleteContato(e.idContato)}>
                                <Text style={[style.textButtom, { color: 'red', textAlign: 'center' }]}>Excluir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setEditContatoMode(false); 
                                setInsertContatoMode(false); 
                                setContatoInEdit('');
                                setValueState('contato', e.contato);
                                setValueState('descricao', e.descricao);
                                handleError(null, 'contato');
                                handleError(null, 'descricao');
                                setEditContatoMode(true); 
                                setContatoInEdit(e.idContato);
                                }}>
                                <Text style={[style.textButtom, { color: "#e65c00", textAlign: 'center', marginLeft: 10}]}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                        {(editContatoMode) && (contatoInEdit === e.idContato)?
                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                {addEditContato()}
                            </View>
                        :null}
                        </Card>
                    )
                })}
                <TouchableOpacity style={[style.button, {backgroundColor: '#05A94E'}]} onPress={() => AtualizaUsuario()}>
                    <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
    
const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}

export default connect(mapStateToProps, null)(EdicaoBarbearia);