import React, { useEffect, useState } from "react";
import { ScrollView, View, SafeAreaView, Text, TouchableOpacity, Alert, Image } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import style from "./style";
import { getUsuario, updateUsuario, updateUsuarioPassword } from "../../services/api";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import globalStyles from "../../globalStyles";

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
    const initialStateErrors = { 'nome': null, 'email': null, 'ncelular': null, 'cpf': null };
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [ncelular, setNcelular] = useState('');
    const [cpf, setCpf] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState(initialStateErrors);
    const [onEditMode, setEditMode] = useState(false);

    const getUsuarioData = async () => {
        const response = getUsuario(JSON.parse(await AsyncStorage.getItem('usuario')).id);
        const data = ((await response).data);
        setNome(data[0].Usr_Nome);
        setEmail(data[0].Usr_Email);
        if (data[0].Usr_Contato !== null) {
            setNcelular(data[0].Usr_Contato);
        }
        if (data[0].Usr_CPF !== null) {
            setCpf(data[0].Usr_CPF)
        }
    }

    const limpaCampos = () => {
        setNome('');
        setEmail('');
        setNcelular('');
        setCpf('');
        setErrors(initialStateErrors);
    }

    useEffect(() => {
        getUsuarioData();
    }, []);

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const AtualizaUsuario = async() => {
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
                await updateUsuario(email, nome, ncelular, cpf, JSON.parse(await AsyncStorage.getItem('usuario')).id);
                Alert.alert('Usuário alterado com sucesso!');
                getUsuarioData();
                setEditMode(false);
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

    const pickImage = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
            quality: 1,
        });

            console.log(res.assets);
        if (!res.canceled) {
            setImage({ uri: res.assets.uri , type: res.assets.type })
        }
    }

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                <Text style={style.textTitle}>Dados do Usuário</Text>
                <View style={style.imageContainer}>
                    <TouchableOpacity onPress={() => pickImage()}>
                        <Image source={image} style={style.image}/>
                    </TouchableOpacity>
                </View>
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
                <View style={{ marginTop: 35, marginBottom: 60 }}>
                    <TouchableOpacity style={style.button} onPress={() => {setEditMode(onEditMode?false:true); {onEditMode?getUsuarioData():null}; {onEditMode?limpaCampos():null};}}>
                        <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>{onEditMode?'Cancelar Edição':'Editar Usuário'}</Text>
                    </TouchableOpacity>
                    {onEditMode?
                        <TouchableOpacity style={[style.button, {backgroundColor: '#05A94E'}]} onPress={() => AtualizaUsuario()}>
                            <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
                        </TouchableOpacity>
                    :null}
                    {!onEditMode?
                        <TouchableOpacity style={[style.button, {backgroundColor: '#E82E2E'}]} onPress={() => navigation.navigate('EditarSenha')}>
                            <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Alterar Senha</Text>
                        </TouchableOpacity>
                    :null}
                </View>
            </View>
        </ScrollView>
    )
}

const EditarSenha = ({ navigation, route }) => {
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const [senha, setSenha] = useState('');
    const [hidePass1, setHidePass1] = useState(true);
    const [senhaConfirmed, setSenhaConfirmed] = useState('');
    const [hidePass2, setHidePass2] = useState(true);
  
    const [errors, setErrors] = React.useState({ 'senhaAntiga': null, 'senha': null, 'senhaConfirmed': null });
  
    const handleError = (error, input) => {
      setErrors(prevState => ({ ...prevState, [input]: error }));
    };
  
    const AtualizaSenha = async() => {
      let isValid = true;
  
      if (senhaAntiga === ''){
        handleError("Deve ser informada a senha antiga", "senhaAntiga");
        isValid = false;
      }

      if (senha.length < 6) {
        handleError("Senha invalida, digite uma senha com no minímo 6 caracteres", "senha");
        isValid = false;
      }
  
      if (senha != senhaConfirmed) {
        handleError("Senhas não coincidem, digite novamente", "senhaConfirmed");
        isValid = false;
      }
  
      if (isValid) {
        try {
            await updateUsuarioPassword(senhaAntiga, senha, JSON.parse(await AsyncStorage.getItem('usuario')).id);
            Alert.alert('Senha alterada com sucesso!');
            navigation.navigate('Perfil');
        } catch (error) {
            if (error.message === "Request failed with status code 401") {
                handleError('Senha antiga incorreta', 'senhaAntiga');
            }
        }
      }
    }

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.containerPassword} >
                <Text style={style.textTitle}>Alterar senha do usuário</Text>
                <SafeAreaView style={style.safeAreaC}>
                    <TextInput
                    style={style.inputC}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white' } }}
                    label="Senha Antiga"
                    error={errors.senhaAntiga !== null ? true : false}
                    onFocus={() => handleError(null, 'senhaAntiga')}
                    secureTextEntry={hidePass}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
                    right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass(!hidePass)} name={hidePass ? "eye-off" : "eye"}></TextInput.Icon>}
                    value={senhaAntiga}
                    onChangeText={(senhaAntiga) => setSenhaAntiga(senhaAntiga)}
                    />
                    <HelperText HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.senhaAntiga !== null ? true : false}>
                        {errors.senhaAntiga}
                    </HelperText>
                    <TextInput
                    style={style.inputC}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white' } }}
                    label="Nova Senha"
                    error={errors.senha !== null ? true : false}
                    onFocus={() => handleError(null, 'senha')}
                    secureTextEntry={hidePass1}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
                    right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass1(!hidePass1)} name={hidePass1 ? "eye-off" : "eye"}></TextInput.Icon>}
                    value={senha}
                    onChangeText={(senha) => setSenha(senha)}
                    />
                    <HelperText HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.senha !== null ? true : false}>
                        {errors.senha}
                    </HelperText>
                    <TextInput
                    style={style.inputC}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white' } }}
                    label="Confirmar Senha"
                    error={errors.senhaConfirmed !== null ? true : false}
                    onFocus={() => handleError(null, 'senhaConfirmed')}
                    secureTextEntry={hidePass2}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
                    right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
                    value={senhaConfirmed}
                    onChangeText={(senhaConfirmed) => setSenhaConfirmed(senhaConfirmed)}
                    />
                    <HelperText style={{ marginBottom: '-4%' }} type="error" visible={errors.senhaConfirmed !== null ? true : false}>
                        {errors.senhaConfirmed}
                    </HelperText>
                    <TouchableOpacity style={[style.button, {backgroundColor: '#05A94E', marginTop: 35}]} onPress={() => AtualizaSenha()}>
                        <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        </ScrollView>
    )
}

export { Perfil, EditarSenha };