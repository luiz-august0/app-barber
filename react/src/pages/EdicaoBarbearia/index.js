import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Image } from "react-native";
import { Card, TextInput, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { connect } from "react-redux";
import { getDadosBarbearia, getDadosCEP, getUsuarioBarbeiroWithEmail, postBarbearia, postContatosBarbearia, postProprietariosBarbearia } from "../../services/api";
import globalFunction from "../../globalFunction";
import globalStyles from "../../globalStyles";
import style from "./style";
import perfil from "../../img/perfil.png";

const validaCNPJ = (cpf) => {
    if (cnpjValidator.isValid(cpf)) {
        return true;
    } else {
        return false;
    }
};

const validarEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};

const EdicaoBarbearia = (props) => {
    const [image, setImage] = useState(null);
    const [state, setState] = useState({
        'nome': null, 'razao': null, 'cnpj': null, 'inscEstadual': null, 'cidade': null, 
        'cep': null, 'uf': null, 'rua': null, 'numero': null, 'bairro': null, 
        'complemento': null, 'latitude': null, 'longitude': null, 'descricao': null, 
        'contato': null, 'email': null
    });
    const [errors, setErrors] = useState({ 
        'nome': null, 'razao': null, 'cnpj': null, 'inscEstadual': null, 'cidade': null, 
        'cep': null, 'uf': null, 'rua': null, 'numero': null, 'bairro': null, 
        'complemento': null, 'latitude': null, 'longitude': null, 'descricao': null, 
        'contato': null, 'email': null
    });
    const [contatos, setContatos] = useState([]);
    const [proprietarios, setProprietarios] = useState([]);
    const [insertContatoMode, setInsertContatoMode] = useState(false);
    const [insertProprietarioMode, setInsertProprietarioMode] = useState(false);
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

    const handleDeleteProprietario = (id) => {
        let newArrayProprietarios = [];
        proprietarios.map((e) => {
            if (e.idProprietario !== id) {
                newArrayProprietarios.push({idProprietario: e.idProprietario, email: e.email, nome: e.nome, contato: e.contato, cpf: e.cpf}); 
            }
        }); 
        setProprietarios(newArrayProprietarios);
    }

    const handleSubmitProprietario = async() => {
        let isValid = true;

        const validateID = (id) => {
            proprietarios.map((e) => {
                if (id === e.idProprietario) { 
                    console.log('aq')
                    return false;
                } else {
                    return true;
                }
            })
        }

        if (state.email === null || state.email === '') {
            handleError('Email deve ser informado', 'email');
            isValid = false;
        }

        if (state.email !== null && state.email !== '') {
            if (!validarEmail(state.email)) {
                handleError('Email inválido', 'email');
                isValid = false;
            }
        }

        if(isValid) {
            try {
                const res = await getUsuarioBarbeiroWithEmail(state.email);
                console.log(validateID(res.data[0].Usr_Codigo) === false)
                if (validateID(res.data[0].Usr_Codigo) === true) {
                    handleError('Email informado já é um proprietário', 'email');
                    isValid = false;
                }
    
                if (isValid) {
                    let newArrayProprietarios = [];
                    proprietarios.map((e) => {
                        newArrayProprietarios.push({idProprietario: e.idProprietario, email: e.email, nome: e.nome, contato: e.contato, cpf: e.cpf});
                    }); 
                    newArrayProprietarios.push({idProprietario: res.data[0].Usr_Codigo, email: res.data[0].Usr_Email, nome: res.data[0].Usr_Nome, contato: res.data[0].Usr_Contato, cpf: res.data[0].Usr_CPF});
                    setProprietarios(newArrayProprietarios);
                }
            } catch (error) {
                console.log(error)
                if (error.message === "Request failed with status code 404") {
                    handleError('Email informado não existe cadastro', 'email');
                    isValid = false;
                }
            }
        }
    }

    useEffect(() => {
        if(props.route.params?.barbeariaID != null) {
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

        if (cep === '') {
            handleError("CEP deve ser informado", "cep");
            return;
        }

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

        if (isValid) {
            try {
                const res = await postBarbearia(state.nome, state.razao, cnpj, state.inscEstadual, state.cidade, cep, state.uf, 
                                    state.rua, state.numero, state.bairro, state.complemento, state.latitude, state.longitude);
                if (res.data.insertId > 0) {
                    if (JSON.stringify(contatos) !== '[]') {
                        contatos.map(async(e) => {
                            await postContatosBarbearia(e.descricao, e.contato, res.data.insertId);
                        })
                    }
                    await postProprietariosBarbearia(props.usuario.state.id, res.data.insertId);
                }
                Alert.alert('Barbearia cadastrada com sucesso!');
                props.navigation.navigate('UsuarioBarbearias');
            } catch (error) {
                if (error.message === "Request failed with status code 401") {
                    handleError('Verifique o CNPJ informado', 'cnpj');
                    handleError('Verifique a IE informada', 'inscEstadual');
                    Alert.alert('CNPJ e inscrição estadual informados já estão cadastrados, verifique')
                }
            }
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

    const addProprietario = () => {
        return (
            <>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    label="Email"
                    keyboardType="email-address"
                    error={errors.email !== null ? true : false}
                    onFocus={() => handleError(null, 'email')}
                    theme={{ colors: { placeholder: `${state.email!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="email" />}
                    value={state.email}
                    onChangeText={(email) => setValueState('email', email)}
                />
                <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.email !== null ? true : false}>
                    {errors.email}
                </HelperText>
                <TouchableOpacity style={[style.button, {backgroundColor: '#05A94E', marginBottom: 10}]} onPress={() => handleSubmitProprietario()}>
                    <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.button, {backgroundColor: '#E82E2E', marginTop: 0}]} onPress={() => {
                    setInsertProprietarioMode(false); 
                    setValueState('email', '');
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
                theme={{ colors: { placeholder: `${state.nome!==null&&state.nome!==''?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
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
                theme={{ colors: { placeholder: `${state.razao!==null&&state.razao!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
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
                theme={{ colors: { placeholder: `${state.cnpj!==null&&state.cnpj!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
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
                onFocus={() => { handleError(null, 'inscEstadual'); Alert.alert('Caso você seja isento de inscrição estadual, deixe o campo correspondente em branco')}}
                theme={{ colors: { placeholder: `${state.inscEstadual!==null&&state.inscEstadual!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
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
                theme={{ colors: { placeholder: `${state.cep!==null&&state.cep!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="home-city" />}
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
                theme={{ colors: { placeholder: `${state.cidade!==null&&state.cidade!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="home-city" />}
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
                keyboardType="default"
                maxLength={2}
                error={errors.uf !== null ? true : false}
                onFocus={() => handleError(null, 'uf')}
                theme={{ colors: { placeholder: `${state.uf!==null&&state.uf!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="home-city" />}
                value={state.uf!== null?state.uf.toUpperCase():null}
                onChangeText={(uf) => setValueState('uf', uf!== null?uf.toUpperCase():null)}
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
                theme={{ colors: { placeholder: `${state.rua!==null&&state.rua!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="home-city" />}
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
                theme={{ colors: { placeholder: `${state.numero!==null&&state.numero!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="home-city" />}
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
                theme={{ colors: { placeholder: `${state.bairro!==null&&state.bairro!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="home-city" />}
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
                theme={{ colors: { placeholder: `${state.complemento!==null&&state.complemento!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="home-city" />}
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
                <Text style={style.textTitle}>Proprietários</Text>    
                <TouchableOpacity onPress={() => {
                    setInsertProprietarioMode(false); 
                    setValueState('email', '');
                    handleError(null, 'email');
                    setInsertProprietarioMode(true);
                    }}>
                    <Text style={[style.textButtom, { color: '#05A94E', fontSize: 16 }]}>Adicionar</Text>
                </TouchableOpacity>
                {insertProprietarioMode?addProprietario():null}
                {proprietarios.map((e) => {
                    return (
                        <Card key={e.idProprietario} style={{width: 300, marginBottom: 10, backgroundColor: '#FFB337'}}>
                        <Card.Title subtitle={
                            `Email: ${e.email}\nNome: ${e.nome}${e.contato!==null&&e.contato!==''?`\nContato: ${e.contato}`:''}${e.cpf!==null&&e.cpf!==''?`\nCPF: ${globalFunction.formataCampo(e.cpf, '000.000.000-00')}`:''}`
                        }
                        subtitleNumberOfLines={0}
                        />
                        {e.idProprietario !== props.usuario.state.id?
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => handleDeleteProprietario(e.idProprietario)}>
                            <Text style={[style.textButtom, { color: 'red', textAlign: 'center' }]}>Excluir</Text>
                        </TouchableOpacity>
                        </View>:null}
                        </Card>
                    )
                })}
                <TouchableOpacity style={[style.button, {backgroundColor: '#05A94E'}]} onPress={() => handleSubmit()}>
                    <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar Dados</Text>
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