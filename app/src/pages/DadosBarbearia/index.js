import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import { Card, TextInput, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { connect } from "react-redux";
import { 
    getDadosBarbearia, 
    getDadosCEP, 
    getUsuarioBarbeiroWithEmail, 
    postBarbearia, 
    postBarbeariaLogo, 
    postContatosBarbearia, 
    postProprietariosBarbearia,
    getGeocoding,
    getContatosBarbearia,
    getProprietariosBarbearia,
    updateBarbearia,
    deleteContatosBarbearia,
    deleteProprietariosBarbearia
} from "../../services/api";
import globalFunction from "../../globalFunction";
import globalStyles from "../../globalStyles";
import style from "./style";
import perfil from "../../img/perfil.png";
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import Loading from "../../components/Loading";

const validaCNPJ = (cpf) => {
    if (cnpjValidator.isValid(cpf)) {
        return true;
    } else {
        return false;
    }
};

const DadosBarbearia = (props) => {
    const [image, setImage] = useState(null);
    const [state, setState] = useState({
        'nome': null, 'razao': null, 'cnpj': null, 'inscEstadual': null, 'cidade': null, 
        'cep': null, 'uf': null, 'rua': null, 'numero': null, 'bairro': null, 
        'complemento': null, 'descricao': null, 
        'contato': null, 'email': null
    });
    const [errors, setErrors] = useState({ 
        'nome': null, 'razao': null, 'cnpj': null, 'inscEstadual': null, 'cidade': null, 
        'cep': null, 'uf': null, 'rua': null, 'numero': null, 'bairro': null, 
        'complemento': null, 'descricao': null, 
        'contato': null, 'email': null
    });
    const [contatos, setContatos] = useState([]);
    const [proprietarios, setProprietarios] = useState([]);
    const [insertContatoMode, setInsertContatoMode] = useState(false);
    const [insertProprietarioMode, setInsertProprietarioMode] = useState(false);
    const [editContatoMode, setEditContatoMode] = useState(false);
    const [contatoInEdit, setContatoInEdit] = useState('');
    const [loadingLogo, setLoadingLogo] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingCEP, setLoadingCEP] = useState(false);
    const [loadingProprietario, setLoadingProprietario] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const getDataBarbearia = async(id) => {
        setLoadingData(true);
        try {
            const response = await getDadosBarbearia(id);
            setValueState('nome', response.data[0].Barb_Nome);
            setValueState('razao', response.data[0].Barb_RazaoSocial);
            setValueState('cnpj', globalFunction.formataCampo(response.data[0].Barb_CNPJ, "00.000.000/0000-00"));

            if (response.data[0].Barb_InscEst !== 'ISENTO') {
                setValueState('inscEstadual', response.data[0].Barb_InscEst);
            }

            setValueState('cidade', response.data[0].Barb_Cidade);
            setValueState('cep', globalFunction.formataCampo(response.data[0].Barb_CEP, "00.000-000"));
            setValueState('uf', response.data[0].Barb_UF);
            setValueState('rua', response.data[0].Barb_Rua);
            setValueState('numero', response.data[0].Barb_Numero.toString());
            setValueState('bairro', response.data[0].Barb_Bairro);

            if (response.data[0].Barb_Complemento !== null && response.data[0].Barb_Complemento !== '') {
                setValueState('complemento', response.data[0].Barb_Complemento);
            }

            if (response.data[0].Barb_LogoUrl !== '' && response.data[0].Barb_LogoUrl !== null) {
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${response.data[0].Barb_LogoUrl}`})
            } else {
                setImage(perfil);
            }

            const responseContatos = await getContatosBarbearia(id);
            if (JSON.stringify(responseContatos.data) !== '[]') {
                let newArrayContatos = [];
                let i = 0;
                responseContatos.data.map((e) => {
                    newArrayContatos.push({idContato: i, descricao: e.BarbC_Descricao, contato: e.BarbC_Contato});
                    i = i + 1;
                });
                setContatos(newArrayContatos);
            }

            const responseProprietarios = await getProprietariosBarbearia(id);
            if (JSON.stringify(responseProprietarios.data) !== '[]') {
                let newArrayProprietarios = [];
                responseProprietarios.data.map(async(e) => {
                    newArrayProprietarios.push({idProprietario: e.Usr_Codigo, email: e.Usr_Email, nome: e.Usr_Nome, contato: e.Usr_Contato, cpf: e.Usr_CPF});
                });
                setProprietarios(newArrayProprietarios);
            }
        } catch (error) {
            console.log(error);
        }
        setLoadingData(false);
    }

    const pickImage = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
            quality: 1,
        })
        
        if (!res.canceled) {
            const file = `data:${res.assets[0].type}/jpeg;base64,${res.assets[0].base64}`;
            setLoadingLogo(true);

            try {
                if (props.route.params?.barbeariaID !== null && props.route.params?.barbeariaID !== '' && props.route.params?.barbeariaID !== undefined) {
                    const responseImage = await postBarbeariaLogo(props.route.params?.barbeariaID, file);
                    setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.assets[0].base64});
                } else {
                    setImage({uri: res.uri, base64: res.assets[0].base64, type: res.assets[0].type});
                }
            } catch (error) {
                Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao realizar o upload da imagem.' );
            }
            setLoadingLogo(false);
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
        const deleteContato = () => {
            let newArrayContatos = [];
            contatos.map((e) => {
                if (e.idContato !== id) {
                    newArrayContatos.push({idContato: e.idContato, descricao: e.descricao, contato: e.contato});
                }
            });
            setContatos(newArrayContatos);
            updateIDContato(newArrayContatos);
        }

        Alert.alert('Confirmação', 'Deseja realmente excluir ?',
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => deleteContato()},
            ],
            { cancelable: true }
        );
    }

    const handleSubmitContato = () => {
        const contatoNoMask = globalFunction.formataCampo(state.contato, '000000000000000');

        const validFields = () => {
            let isValid = true;

            if (contatoNoMask === '' || contatoNoMask === null) {
                isValid = false;
                handleError("Número de contato deve ser informado", "contato");
            }

            if (state.descricao === '') {
                isValid = false;
                handleError("Descrição do contato deve ser informada", "descricao"); 
            }

            if (contatoNoMask !== '' && contatoNoMask !== null) {
                if (contatoNoMask.trim().length < 11 || contatoNoMask.trim().length > 11) {
                    isValid = false;
                    handleError("Número de contato inválido", "contato");
                }
            }

            contatos.map((e) => {
                if (contatoInEdit !== '') {
                    if ((e.contato === contatoNoMask) && (e.idContato !== contatoInEdit)) {
                        isValid = false;
                        handleError('Contato informado já existente', 'contato');
                    }
                } else {
                    if (e.contato === contatoNoMask) {
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
                    if (e.idContato === contatoInEdit) return {idContato: contatoInEdit, descricao: state.descricao, contato: contatoNoMask};
                    return e;
                });
                setContatos(newArrayContatos);
            } else {
                contatos.map((e) => {
                    newArrayContatos.push({idContato: e.idContato, descricao: e.descricao, contato: e.contato});
                }); 
                newArrayContatos.push({idContato: contatos.length + 1, descricao: state.descricao, contato: contatoNoMask});
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

    const handleDeleteProprietario = (id) => {
        const deleteProprietario = () => {
            let newArrayProprietarios = [];
            proprietarios.map((e) => {
                if (e.idProprietario !== id) {
                    newArrayProprietarios.push({idProprietario: e.idProprietario, email: e.email, nome: e.nome, contato: e.contato, cpf: e.cpf}); 
                }
            }); 
            setProprietarios(newArrayProprietarios);
        }

        Alert.alert('Confirmação', 'Deseja realmente excluir ?',
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => deleteProprietario()},
            ],
            { cancelable: true }
        );
    }

    const handleSubmitProprietario = async() => {
        let isValid = true;

        if (state.email === null || state.email === '') {
            handleError('Email deve ser informado', 'email');
            isValid = false;
        }

        if (state.email !== null && state.email !== '') {
            if (!globalFunction.validarEmail(state.email)) {
                handleError('Email inválido', 'email');
                isValid = false;
            }
        }

        if(isValid) {
            setLoadingProprietario(true);
            try {
                const res = await getUsuarioBarbeiroWithEmail(state.email);
                proprietarios.map((e) => {
                    if (res.data[0].Usr_Codigo == e.idProprietario) { 
                        handleError('Email informado já é um proprietário', 'email');
                        isValid = false;
                    }
                })
    
                if (isValid) {
                    let newArrayProprietarios = [];
                    proprietarios.map((e) => {
                        newArrayProprietarios.push({idProprietario: e.idProprietario, email: e.email, nome: e.nome, contato: e.contato, cpf: e.cpf});
                    }); 
                    newArrayProprietarios.push({idProprietario: res.data[0].Usr_Codigo, email: res.data[0].Usr_Email, nome: res.data[0].Usr_Nome, contato: res.data[0].Usr_Contato, cpf: res.data[0].Usr_CPF});
                    setProprietarios(newArrayProprietarios);

                    setInsertProprietarioMode(false);
                    setValueState('email', '');
                    handleError(null, 'email');
                }
            } catch (error) {
                console.log(error)
                if (error.message === "Request failed with status code 404") {
                    handleError('Email informado não existe cadastro', 'email');
                    isValid = false;
                }
            }
            setLoadingProprietario(false);
        }
    }

    useEffect(() => {
        if(props.route.params?.barbeariaID != null && props.route.params?.barbeariaID !== '' && props.route.params?.barbeariaID !== undefined) {
            getDataBarbearia(props.route.params?.barbeariaID);
        } else {
            setImage(perfil);
            let newArrayProprietarios = [];
            newArrayProprietarios.push({idProprietario: props.usuario.state.id, email: props.usuario.state.email, nome: props.usuario.state.nome, contato: props.usuario.state.contato==='ul'?null:props.usuario.state.contato, cpf: props.usuario.state.cpf==='ul'?null:props.usuario.state.cpf})
            setProprietarios(newArrayProprietarios);
        }
    }, []);

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

        const cleanFields = () => {
            setValueState('rua', null);
            setValueState('complemento', null);
            setValueState('bairro', null);
            setValueState('cidade', null);
            setValueState('uf', null);
        }

        if (cep === '') {
            handleError("CEP deve ser informado", "cep");
            return;
        }

        if (cep.length !== 8) {
            handleError("CEP inválido", "cep");
            return;
        }

        setLoadingCEP(true);
        try {            
            const response = await getDadosCEP(cep);
            if (!response.data.erro) {
                if (response.data.logradouro !== "") {
                    setValueState('rua', response.data.logradouro);
                    handleError(null, 'rua');
                }
                if (response.data.complemento !== "") {
                    setValueState('complemento', response.data.complemento);
                    handleError(null, 'complemento');
                }
                if (response.data.bairro !== "") {
                    setValueState('bairro', response.data.bairro);
                    handleError(null, 'bairro');
                }
                if (response.data.localidade !== "") {
                    setValueState('cidade', response.data.localidade);
                    handleError(null, 'cidade');
                }
                if (response.data.uf !== "") {
                    setValueState('uf', response.data.uf);
                    handleError(null, 'uf');
                }
            } else {
                handleError("CEP inválido", "cep");
                cleanFields();
            }
        } catch (error) {
            console.log(error);
            cleanFields();
        }
        setLoadingCEP(false);
    }

    const handleSubmit = async() => {
        let isValid = true;
        const cnpj = globalFunction.formataCampo(state.cnpj, "00000000000000");
        const cep = globalFunction.formataCampo(state.cep, "00000000");

        if (state.nome === null || state.nome === '') {
            handleError('Nome deve ser informado', 'nome');
            isValid = false;
        }

        if (state.razao === null || state.razao === '') {
            handleError('Razão social deve ser informada', 'razao');
            isValid = false;
        }

        if (cnpj === null || cnpj === '') {
            handleError('CNPJ deve ser informado', 'cnpj');
            isValid = false;
        }

        if (cnpj !== null && cnpj !== '') {
            if (!validaCNPJ(cnpj)) {
                handleError('CNPJ informado não é valido', 'cnpj');
                isValid = false;
            }
        }

        if (cep === '') {
            handleError("CEP deve ser informado", "cep");
            isValid = false;
        }

        if (cep !== '') {
            if (cep.length !== 8) {
                handleError("CEP inválido", "cep");
                isValid = false;
            }
        }

        if (state.cidade === null || state.cidade === '') {
            handleError('Cidade deve ser informada', 'cidade');
            isValid = false;
        }

        if (state.uf === null || state.uf === '') {
            handleError('UF deve ser informada', 'uf');
            isValid = false;
        }

        if (state.uf !== null && state.uf !== '') {
            if (state.uf.length !== 2) {
                handleError('UF deve ter apenas 2 caracteres, por exemplo "PR"', 'uf');
                isValid = false;
            }
        }

        if (state.rua === null || state.rua === '') {
            handleError('Rua deve ser informada', 'rua');
            isValid = false;
        }

        if (state.numero === null || state.numero === '') {
            handleError('Número do endereço deve ser informado', 'numero');
            isValid = false;
        }

        if (state.bairro === null || state.bairro === '') {
            handleError('Bairro deve ser informado', 'bairro');
            isValid = false;
        }

        setLoadingSubmit(true);
        const responseGeo = await getGeocoding(state.rua, state.numero, state.bairro, state.cidade, state.uf, cep);
        if (responseGeo.data.status == 'ZERO_RESULTS') {
            Alert.alert('Atenção', 'Não foi possível localizar a geolocalização do endereço informado, verifique');
            isValid = false;
        }
        setLoadingSubmit(false);

        if (isValid) {
            setLoadingSubmit(true);
            try {
                if (props.route.params?.barbeariaID !== null && props.route.params?.barbeariaID !== '' && props.route.params?.barbeariaID !== undefined) {
                    await updateBarbearia(state.nome, state.razao, cnpj, state.inscEstadual, state.cidade, cep, state.uf, 
                        state.rua, state.numero, state.bairro, state.complemento, responseGeo.data.results[0].geometry.location.lat, 
                        responseGeo.data.results[0].geometry.location.lng, props.route.params?.barbeariaID);

                    await deleteContatosBarbearia(null, props.route.params?.barbeariaID);
                    if (JSON.stringify(contatos) !== '[]') {
                        contatos.map(async(e) => {
                            await postContatosBarbearia(e.descricao, e.contato, props.route.params?.barbeariaID);
                        })
                    }
                    await deleteProprietariosBarbearia(null, props.route.params?.barbeariaID);
                    proprietarios.map(async(e) => {
                        await postProprietariosBarbearia(e.idProprietario, props.route.params?.barbeariaID);
                    })
                    props.navigation.navigate('MenuBarbearia', { barbeariaID: props.route.params?.barbeariaID });
                    Alert.alert('Atenção', 'Dados da barbearia atualizados com sucesso!');
                } else {
                    const res = await postBarbearia(state.nome, state.razao, cnpj, state.inscEstadual, state.cidade, cep, state.uf, 
                        state.rua, state.numero, state.bairro, state.complemento, responseGeo.data.results[0].geometry.location.lat, 
                        responseGeo.data.results[0].geometry.location.lng);
                    if (res.data.insertId > 0) {
                        if (JSON.stringify(contatos) !== '[]') {
                            contatos.map(async(e) => {
                                await postContatosBarbearia(e.descricao, e.contato, res.data.insertId);
                            })
                        }
                        proprietarios.map(async(e) => {
                            await postProprietariosBarbearia(e.idProprietario, res.data.insertId);
                        })
                    }
                    if (image.base64 !== undefined) {
                        const file = `data:${image.type}/jpeg;base64,${image.base64}`;
                        await postBarbeariaLogo(res.data.insertId, file);
                    }
                    props.navigation.navigate('MenuBarbearia', { barbeariaID: res.data.insertId });
                    Alert.alert('Atenção', 'Barbearia cadastrada com sucesso!');
                }                
            } catch (error) {
                if (error.message === "Request failed with status code 401") {
                    handleError('Verifique o CNPJ informado', 'cnpj');
                    handleError('Verifique a IE informada', 'inscEstadual');
                    Alert.alert('Atenção', 'CNPJ e inscrição estadual informados já estão cadastrados, verifique')
                }
                console.log(error);
            }
            setLoadingSubmit(false);
        } else {
            Alert.alert('Atenção', 'Alguns campos não foram preenchidos corretamente, verifique');
        }
    }

    const addEditContato = () => {
        return (
            <>
                <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Descrição"
                    error={errors.descricao !== null ? true : false}
                    onFocus={() => handleError(null, 'descricao')}
                    theme={{ colors: { placeholder: `${state.descricao!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="account" />}
                    value={state.descricao}
                    onChangeText={(descricao) => setValueState('descricao', descricao)}
                />
                <HelperText type="error" visible={errors.descricao !== null ? true : false}>
                    {errors.descricao}
                </HelperText>
                <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Contato"
                    keyboardType="number-pad"
                    error={errors.contato !== null ? true : false}
                    onFocus={() => handleError(null, 'contato')}
                    theme={{ colors: { placeholder: `${state.contato!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="account" />}
                    value={globalFunction.formataTelefone(state.contato)}
                    onChangeText={(contato) => setValueState('contato', globalFunction.formataTelefone(contato))}
                />
                <HelperText type="error" visible={errors.contato !== null ? true : false}>
                    {errors.contato}
                </HelperText>
                <TouchableOpacity style={[style.button, {backgroundColor: '#2B513B', marginBottom: 10}]} onPress={() => handleSubmitContato()}>
                    <Text style={{ color: "#FFCA9F", fontSize: 14, fontFamily: 'Manrope-Regular' }}>CONFIRMAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.button, {backgroundColor: '#71150D', marginTop: 0}]} onPress={() => {
                    setEditContatoMode(false);
                    setInsertContatoMode(false); 
                    setValueState('contato', '');
                    setValueState('descricao', '');
                    setContatoInEdit('');
                    }}>
                    <Text style={{ color: "#FFCA9F", fontSize: 14, fontFamily: 'Manrope-Regular' }}>CANCELAR</Text>
                </TouchableOpacity>
            </>
        )
    }

    const addProprietario = () => {
        return (
            <>
                <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Email"
                    keyboardType="email-address"
                    error={errors.email !== null ? true : false}
                    editable={!loadingProprietario}
                    onFocus={() => handleError(null, 'email')}
                    theme={{ colors: { placeholder: `${state.email!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="email" />}
                    value={state.email}
                    onChangeText={(email) => setValueState('email', email)}
                />
                <HelperText type="error" visible={errors.email !== null ? true : false}>
                    {errors.email}
                </HelperText>
                <TouchableOpacity style={[style.button, {backgroundColor: '#2B513B', marginBottom: 10}]} onPress={() => handleSubmitProprietario()}>
                    {!loadingProprietario?
                    <Text style={{ color: "#FFCA9F", fontSize: 14, fontFamily: 'Manrope-Regular' }}>CONFIRMAR</Text>
                    :<ActivityIndicator/>}
                </TouchableOpacity>
                {!loadingProprietario?
                <TouchableOpacity style={[style.button, {backgroundColor: '#71150D', marginTop: 0}]} onPress={() => {
                    setInsertProprietarioMode(false); 
                    setValueState('email', '');
                    }}>
                    <Text style={{ color: "#FFCA9F", fontSize: 14, fontFamily: 'Manrope-Regular' }}>CANCELAR</Text>
                </TouchableOpacity>:null}
            </>
        )
    }

    if (loadingData) {
        return <Loading/>
    } else {
    return (
        <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                {loadingLogo?
                    <View style={[style.containerIndicator, style.horizontalIndicator]}>
                        <ActivityIndicator/>
                    </View>
                    :
                    <View style={style.imageContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image source={image} style={style.image}/>
                        </TouchableOpacity>
                    </View>
                }
                <Text style={style.textSubtitle}>Clique na imagem para mudar a logo da barbearia</Text>
                <View style={style.viewInputs}>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Nome"
                    error={errors.nome !== null ? true : false}
                    onFocus={() => handleError(null, 'nome')}
                    theme={{ colors: { placeholder: `${state.nome!==null&&state.nome!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="account" />}
                    value={state.nome}
                    onChangeText={(nome) => setValueState('nome', nome)}
                    />
                    <HelperText type="error" visible={errors.nome !== null ? true : false}>
                        {errors.nome}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Razão Social"
                    error={errors.razao !== null ? true : false}
                    onFocus={() => handleError(null, 'razao')}
                    theme={{ colors: { placeholder: `${state.razao!==null&&state.razao!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="account" />}
                    value={state.razao}
                    onChangeText={(razao) => setValueState('razao', razao)}
                    />
                    <HelperText type="error" visible={errors.razao !== null ? true : false}>
                        {errors.razao}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="CNPJ"
                    keyboardType="number-pad"
                    error={errors.cnpj !== null ? true : false}
                    onFocus={() => handleError(null, 'cnpj')}
                    theme={{ colors: { placeholder: `${state.cnpj!==null&&state.cnpj!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="account" />}
                    value={globalFunction.formataCampo(state.cnpj, "00.000.000/0000-00")}
                    onChangeText={(cnpj) => setValueState('cnpj', globalFunction.formataCampo(cnpj, "00.000.000/0000-00"))}
                    />
                    <HelperText type="error" visible={errors.cnpj !== null ? true : false}>
                        {errors.cnpj}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="IE"
                    keyboardType="number-pad"
                    error={errors.inscEstadual !== null ? true : false}
                    onFocus={() => { handleError(null, 'inscEstadual'); Alert.alert('Atenção', 'Caso você seja isento de inscrição estadual, deixe o campo correspondente em branco')}}
                    theme={{ colors: { placeholder: `${state.inscEstadual!==null&&state.inscEstadual!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="account" />}
                    value={state.inscEstadual}
                    onChangeText={(inscEstadual) => setValueState('inscEstadual', inscEstadual)}
                    />
                    <HelperText type="error" visible={errors.inscEstadual !== null ? true : false}>
                        {errors.inscEstadual}
                    </HelperText>
                    {loadingCEP?
                    <View style={style.viewCEP} >
                        <Text style={[style.text, { color: '#BA6213' }]} >Consultando CEP...</Text>
                        <ActivityIndicator/>
                    </View>
                    :
                    <>
                        <TextInput
                        style={style.input}
                        mode='flat'
                        activeOutlineColor='#000'
                        label="CEP"
                        keyboardType="number-pad"
                        error={errors.cep !== null ? true : false}
                        onFocus={() => onFocusCEP()}
                        onEndEditing={() => consultaCEP()}
                        theme={{ colors: { placeholder: `${state.cep!==null&&state.cep!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                        left={<TextInput.Icon color="#000" name="home-city" />}
                        value={globalFunction.formataCampo(state.cep, "00.000-000")}
                        onChangeText={(cep) => setValueState('cep', globalFunction.formataCampo(cep, "00.000-000"))}
                        />
                        <HelperText type="error" visible={errors.cep !== null ? true : false}>
                            {errors.cep}
                        </HelperText>
                    </>
                    }
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Cidade"
                    editable={!loadingCEP}
                    error={errors.cidade !== null ? true : false}
                    onFocus={() => handleError(null, 'cidade')}
                    theme={{ colors: { placeholder: `${state.cidade!==null&&state.cidade!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="home-city" />}
                    value={state.cidade}
                    onChangeText={(cidade) => setValueState('cidade', cidade)}
                    />
                    <HelperText type="error" visible={errors.cidade !== null ? true : false}>
                        {errors.cidade}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="UF"
                    editable={!loadingCEP}
                    keyboardType="default"
                    maxLength={2}
                    error={errors.uf !== null ? true : false}
                    onFocus={() => handleError(null, 'uf')}
                    theme={{ colors: { placeholder: `${state.uf!==null&&state.uf!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="home-city" />}
                    value={state.uf!== null?state.uf.toUpperCase():null}
                    onChangeText={(uf) => setValueState('uf', uf!== null?uf.toUpperCase():null)}
                    />
                    <HelperText type="error" visible={errors.uf !== null ? true : false}>
                        {errors.uf}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Rua"
                    editable={!loadingCEP}
                    error={errors.rua !== null ? true : false}
                    onFocus={() => handleError(null, 'rua')}
                    theme={{ colors: { placeholder: `${state.rua!==null&&state.rua!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="home-city" />}
                    value={state.rua}
                    onChangeText={(rua) => setValueState('rua', rua)}
                    />
                    <HelperText type="error" visible={errors.rua !== null ? true : false}>
                        {errors.rua}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Número"
                    editable={!loadingCEP}
                    keyboardType="number-pad"
                    error={errors.numero !== null ? true : false}
                    onFocus={() => handleError(null, 'numero')}
                    theme={{ colors: { placeholder: `${state.numero!==null&&state.numero!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="home-city" />}
                    value={state.numero}
                    onChangeText={(numero) => setValueState('numero', numero)}
                    />
                    <HelperText type="error" visible={errors.numero !== null ? true : false}>
                        {errors.numero}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Bairro"
                    editable={!loadingCEP}
                    error={errors.bairro !== null ? true : false}
                    onFocus={() => handleError(null, 'bairro')}
                    theme={{ colors: { placeholder: `${state.bairro!==null&&state.bairro!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="home-city" />}
                    value={state.bairro}
                    onChangeText={(bairro) => setValueState('bairro', bairro)}
                    />
                    <HelperText type="error" visible={errors.bairro !== null ? true : false}>
                        {errors.bairro}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#000'
                    label="Complemento"
                    editable={!loadingCEP}
                    error={errors.complemento !== null ? true : false}
                    onFocus={() => handleError(null, 'complemento')}
                    theme={{ colors: { placeholder: `${state.complemento!==null&&state.complemento!==''?"#000":"#000"}`, text: '#000', primary: '#000' } }}
                    left={<TextInput.Icon color="#000" name="home-city" />}
                    value={state.complemento}
                    onChangeText={(complemento) => setValueState('complemento', complemento)}
                    />
                    <HelperText type="error" visible={errors.complemento !== null ? true : false}>
                        {errors.complemento}
                    </HelperText>
                </View>
                <Text style={style.textTitle}>CONTATOS</Text>    
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
                    <Text style={[style.textButtom, { color: '#BA6213', fontSize: 16 }]}>ADICIONAR</Text>
                </TouchableOpacity>
                {insertContatoMode?addEditContato():null}
                {contatos.map((e) => {
                    return (
                        <Card key={e.idContato} style={{width: 300, marginBottom: 10, backgroundColor: '#BA6213'}}>
                        <Card.Title title={`${e.descricao}: ${globalFunction.formataTelefone(e.contato)}`}
                                    titleStyle={{fontFamily: 'Manrope-Bold', color: '#FFCA9F'}}
                                    titleNumberOfLines={0}/>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => handleDeleteContato(e.idContato)}>
                                <Text style={[style.textButtom, { color: '#71150D', textAlign: 'center' }]}>EXCLUIR</Text>
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
                                <Text style={[style.textButtom, { color: "#2B513B", textAlign: 'center', marginLeft: 10}]}>EDITAR</Text>
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
                <Text style={style.textTitle}>PROPRIETÁRIOS</Text>    
                <TouchableOpacity onPress={() => {
                    setInsertProprietarioMode(false); 
                    setValueState('email', '');
                    handleError(null, 'email');
                    setInsertProprietarioMode(true);
                    }}>
                    <Text style={[style.textButtom, { color: '#BA6213', fontSize: 16 }]}>ADICIONAR</Text>
                </TouchableOpacity>
                {insertProprietarioMode?addProprietario():null}
                {proprietarios.map((e) => {
                    return (
                        <Card key={e.idProprietario} style={{width: 300, marginBottom: 10, backgroundColor: '#BA6213'}}>
                        <Card.Title subtitle={
                            `Email: ${e.email}\nNome: ${e.nome}${e.contato!==null&&e.contato!==''?`\nContato: ${globalFunction.formataTelefone(e.contato)}`:''}${e.cpf!==null&&e.cpf!==''?`\nCPF: ${globalFunction.formataCampo(e.cpf, '000.000.000-00')}`:''}`
                        }
                        subtitleNumberOfLines={0}
                        subtitleStyle={{fontFamily: 'Manrope-Bold', color: '#FFCA9F'}}
                        />
                        {e.idProprietario != props.usuario.state.id?
                        <TouchableOpacity onPress={() => handleDeleteProprietario(e.idProprietario)}>
                            <Text style={[style.textButtom, { color: '#71150D', textAlign: 'center' }]}>EXCLUIR</Text>
                        </TouchableOpacity>:null}
                        </Card>
                    )
                })}
                <TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={[style.button, { marginBottom: 30, width: 280 }]} onPress={() => {!loadingSubmit?handleSubmit():null}}>
                    {loadingSubmit?<ActivityIndicator/>:<Text style={style.text}>CONFIRMAR DADOS</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingWrapper>
    )}
}
    
const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}

export default connect(mapStateToProps, null)(DadosBarbearia);