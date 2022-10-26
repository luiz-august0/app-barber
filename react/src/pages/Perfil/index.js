import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import style from "./style";
import { getUsuario } from "../../services/api";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import AsyncStorage from "@react-native-async-storage/async-storage";

const validarEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};
  
  const validaCPF = (cpf) => {
    if (cpfValidator.isValid(cpf)) {
        return true;
    } else {
        return false;
    }
};

const Perfil = ({ navigation, route }) => {
    const [nome, setNome] = useState();
    const [email, setEmail] = useState();
    const [ncelular, setNcelular] = useState();
    const [cpf, setCpf] = useState();
    const [errors, setErrors] = useState({ 'nome': null, 'snome': null, 'email': null, 'ncelular': null, 'cpf': null });
    const [onEditMode, setEditMode] = useState(false);

    const getUsuarioData = async () => {
        const response = getUsuario(JSON.parse(await AsyncStorage.getItem('usuario')).id);
        const data = ((await response).data);
        setNome(data[0].Usr_Nome);
        setEmail(data[0].Usr_Email);
        setNcelular(data[0].Usr_Contato);
        setCpf(data[0].Usr_CPF)
    }

    useEffect(() => {
        getUsuarioData();
    }, []);

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const AtualizaUsuario = async () => {
        let isValid = true;

        if (nome == "") {
            handleError("Nome inválido", "nome");
            isValid = false;
        }

        if (validarEmail(email) === false) {
            handleError("Email inválido", "email");
            isValid = false;
        }

        if (ncelular.length > 0) {
            if (ncelular.length < 11 || ncelular.length > 11) {
                handleError("Número de telefone inválido", "ncelular");
                isValid = false;
            }
        }

        if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf === '') {
            handleError("CPF deve ser informado", "cpf");
            isValid = false;
        }

        if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf !== '' && !validaCPF(cpf)) {
            handleError("CPF inválido", "cpf");
            isValid = false;
        }

        if (await AsyncStorage.getItem('TipoUsuario') === "C" && cpf !== '' && !validaCPF(cpf)) {
            handleError("CPF inválido", "cpf");
            isValid = false;
        }

        if (isValid) {
            try {
                let nomeCompleto = nome + ' ' + snome;
                let tipo = await AsyncStorage.getItem('TipoUsuario')
                await createUsuario(email, nomeCompleto, senha, ncelular, cpf, tipo);
                Alert.alert('Usuário cadastrado com sucesso!');
                navigation.navigate('Login');
            } catch (error) {
                if (error.message === "Request failed with status code 400") {
                    handleError('Email já cadastrado', 'email');
                }

                if (error.message === "Request failed with status code 406") {
                    handleError('CPF já cadastrado', 'cpf');
                }
            }
        }
    }

    return (
        <View style={style.container}>
            <Text style={style.textTitle}>Dados do Usuário</Text>
            <TextInput
                style={style.inputC}
                mode='outlined'
                activeOutlineColor='#fff'
                label="Nome"
                error={errors.nome !== null ? true : false}
                onFocus={() => handleError(null, 'nome')}
                theme={{ colors: { placeholder: 'white', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={nome}
                onChangeText={(nome) => setNome(nome)}
                editable={onEditMode}
            />
            <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.nome !== null ? true : false}>
                {errors.nome}
            </HelperText>
            <TextInput
                style={style.inputC}
                mode='outlined'
                activeOutlineColor='#fff'
                keyboardType='email-address'
                label="Email"
                error={errors.email !== null ? true : false}
                onFocus={() => handleError(null, 'email')}
                theme={{ colors: { placeholder: 'white', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="email" />}
                value={email}
                onChangeText={(email) => setEmail(email)}
                editable={onEditMode}
            />
            <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.email !== null ? true : false}>
                {errors.email}
            </HelperText>
            <TextInput
                style={style.inputC}
                mode='outlined'
                activeOutlineColor='#fff'
                keyboardType='phone-pad'
                label="Celular"
                error={errors.ncelular !== null ? true : false}
                onFocus={() => handleError(null, 'ncelular')}
                theme={{ colors: { placeholder: 'white', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="phone" />}
                value={ncelular}
                onChangeText={(ncelular) => setNcelular(ncelular)}
                editable={onEditMode}
            />
            <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.ncelular !== null ? true : false}>
                {errors.ncelular}
            </HelperText>
            <TextInput
                style={style.inputC}
                mode='outlined'
                activeOutlineColor='#fff'
                keyboardType='numeric'
                label="CPF"
                error={errors.cpf !== null ? true : false}
                onFocus={() => handleError(null, 'cpf')}
                theme={{ colors: { placeholder: 'white', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
                value={cpf}
                onChangeText={(cpf) => setCpf(cpf)}
                editable={onEditMode}
            />
            <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.cpf !== null ? true : false}>
                {errors.cpf}
            </HelperText>
            <TouchableOpacity style={style.button} onPress={() => setEditMode(onEditMode?false:true)}>
                <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>{onEditMode?'Cancelar Edição':'Editar Usuário'}</Text>
            </TouchableOpacity>
            {onEditMode?
                <TouchableOpacity style={[style.button, {backgroundColor: '#05A94E'}]}>
                    <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
                </TouchableOpacity>
            :null}
        </View>
    )
}

export default Perfil;