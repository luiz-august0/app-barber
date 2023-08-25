import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image, ActivityIndicator } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import style from "./style";
import { createUsuario, getDataBarbeiro, getUsuario, postBarbeiro, updateBarbeiro, updateUsuario, updateUsuarioFoto } from "../../services/api";
import * as ImagePicker from 'expo-image-picker';
import globalStyles from "../../globalStyles";
import globalFunction from "../../globalFunction";
import perfil from "../../img/perfil.png";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import { usuarioLogado } from "../../store/actions/usuario";
import { connect } from "react-redux";
import Loading from "../../components/Loading";

const DadosBarbeiro = (props) => {
    const initialStateErrors = { 'nome': null, 'email': null, 'ncelular': null, 'cpf': null, 'senha': null, 'senhaConfirmed': null, 'espec': null};
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [ncelular, setNcelular] = useState('');
    const [cpf, setCpf] = useState('');
    const [espec, setEspec] = useState('');
    const [image, setImage] = useState(null);
    const [senha, setSenha] = useState('');
    const [hidePass1, setHidePass1] = useState(true);
    const [senhaConfirmed, setSenhaConfirmed] = useState('');
    const [hidePass2, setHidePass2] = useState(true);
    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    
    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const getUsuarioData = async () => {
        setLoadingData(true);
        const response = await getDataBarbeiro(props.route.params?.barbeariaID, props.route.params?.barbeiroID);
        const data = response.data;

        if (data[0].Usr_FotoPerfil !== '' && data[0].Usr_FotoPerfil !== null) {
            setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${data[0].Usr_FotoPerfil}`})
        } else {
            setImage(perfil);
        }
        setNome(data[0].Usr_Nome);
        setEmail(data[0].Usr_Email);
        if (data[0].Usr_Contato !== null) {
            setNcelular(data[0].Usr_Contato);
        }
        if (data[0].Usr_CPF !== null) {
            setCpf(data[0].Usr_CPF)
        }
        if (data[0].BarbB_Especialidade !== null) {
            setEspec(data[0].BarbB_Especialidade)
        }
        setLoadingData(false);
    }

    useEffect(() => {
        if (props.route.params?.barbeiroID!==undefined&&props.route.params?.barbeiroID!==null&&props.route.params?.barbeiroID!=='') {
            getUsuarioData();
        } else {
            setImage(perfil);
        }
    }, []);

    const updateStoreUsuario = async() => {
        const response = await getUsuario(props.usuario.state.id);
        const data = response.data;
        props.onEdit({
            id: data[0].Usr_Codigo,
            email: data[0].Usr_Email,
            nome: data[0].Usr_Nome,
            contato: data[0].Usr_Contato,
            cpf: data[0].Usr_CPF,
            tipo: data[0].Usr_Tipo,
            urlImagem: data[0].Usr_FotoPerfil
        })
    }

    const handleSubmit = async() => {
        let isValid = true;
        const cpfNoMask = globalFunction.formataCampo(cpf, '00000000000');
        const contatoNoMask = globalFunction.formataCampo(ncelular, '000000000000000');

        if (nome == "") {
            handleError("Nome inválido", "nome");
            isValid = false;
        }

        if (globalFunction.validarEmail(email) === false) {
            handleError("Email inválido", "email");
            isValid = false;
        }

        if (contatoNoMask.length > 0) {
            if (contatoNoMask.length < 11 || contatoNoMask.length > 11) {
                handleError("Número de telefone inválido", "ncelular");
                isValid = false;
            }
        }

        if (cpfNoMask === '') {
            handleError("CPF deve ser informado", "cpf");
            isValid = false;
        }

        if (cpfNoMask !== '' && !globalFunction.validaCPF(cpfNoMask)) {
            handleError("CPF inválido", "cpf");
            isValid = false;
        }

        if (props.route.params?.barbeiroID==undefined||props.route.params?.barbeiroID==null||props.route.params?.barbeiroID=='') {
            if (globalFunction.validaSenha(senha).erro) {
                handleError(globalFunction.validaSenha(senha).mensagem, "senha");
                isValid = false;
              }
          
            if (senha != senhaConfirmed) {
                handleError("Senhas não coincidem, digite novamente", "senhaConfirmed");
                isValid = false;
            }
        }

        if (isValid) {
            setLoadingSubmit(true);
            try {
                if (props.route.params?.barbeiroID!==undefined&&props.route.params?.barbeiroID!==null&&props.route.params?.barbeiroID!=='') {
                    await updateUsuario(email.trim(), nome, contatoNoMask, cpfNoMask, props.route.params?.barbeiroID);
                    await updateBarbeiro(props.route.params?.barbeariaID, props.route.params?.barbeiroID, espec);
                    if (props.route.params?.barbeiroID.toString() == props.usuario.state.id.toString()) {
                        updateStoreUsuario();
                    }
                    Alert.alert('Atenção', 'Barbeiro alterado com sucesso');
                    props.navigation.navigate("MenuBarbeiro", { barbeariaID: props.route.params?.barbeariaID, barbeiroID: props.route.params?.barbeiroID});
                } else {
                    const response = await createUsuario(email.trim(), nome, senha, contatoNoMask, cpfNoMask, 'F');
                    const data = response.data;
                    await postBarbeiro(props.route.params?.barbeariaID, data.insertId, espec);
                    if (image.base64 !== undefined) {
                        const file = `data:${image.type}/jpeg;base64,${image.base64}`;
                        await updateUsuarioFoto(data.insertId, file);
                    }
                    Alert.alert('Atenção', 'Barbeiro cadastrado com sucesso');
                    props.navigation.navigate("MenuBarbeiro", { barbeariaID: props.route.params?.barbeariaID, barbeiroID: data.insertId});
                }
            } catch (error) {
                if (error.message === "Request failed with status code 400") {
                    handleError('Email já cadastrado', 'email');
                }

                if (error.message === "Request failed with status code 406") {
                    handleError('CPF já cadastrado', 'cpf');
                }
            }
            setLoadingSubmit(false);
        } else {
            Alert.alert('Atenção', 'Alguns campos não foram preenchidos corretamente, verifique');
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
        
        if (!res.canceled) {
            const file = `data:${res.assets[0].type}/jpeg;base64,${res.assets[0].base64}`;

            try {
                setLoading(true);
                if (props.route.params?.barbeiroID!==undefined&&props.route.params?.barbeiroID!==null&&props.route.params?.barbeiroID!=='') {
                    const responseImage = await updateUsuarioFoto(props.route.params?.barbeiroID, file);
                    setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.assets[0].base64});
                } else {
                    setImage({uri: res.uri, base64: res.assets[0].base64});
                }
                setLoading(false);
            } catch (error) {
                Alert.alert('Atenção', 'Ops, ocorreu algum erro ao realizar o upload da imagem, contate o suporte' );
                setLoading(false);
            }
        }
        
    }

    if (loadingData) {
        return <Loading/>
    } else {
    return (
        <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                {loading?
                <View style={[style.containerIndicator, style.horizontalIndicator]}>
                    <ActivityIndicator/>
                </View>:
                <View style={style.imageContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image source={image} style={style.image}/>
                    </TouchableOpacity>
                </View>
                }
                <Text style={style.text}>Clique na imagem para mudar a foto de perfil</Text>
                    <TextInput
                        style={style.input}
                        mode='flat'
                        activeOutlineColor='#FFCA9F'
                        label="Nome"
                        error={errors.nome !== null ? true : false}
                        onFocus={() => handleError(null, 'nome')}
                        theme={{ colors: { placeholder: `${nome!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                        left={<TextInput.Icon color="#FFCA9F" name="account" />}
                        value={nome}
                        onChangeText={(nome) => setNome(nome)}
                    />
                    <HelperText type="error" visible={errors.nome !== null ? true : false}>
                        {errors.nome}
                    </HelperText>
                    <TextInput
                        style={style.input}
                        mode='flat'
                        activeOutlineColor='#FFCA9F'
                        keyboardType='email-address'
                        label="Email"
                        error={errors.email !== null ? true : false}
                        onFocus={() => handleError(null, 'email')}
                        theme={{ colors: { placeholder: `${email!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                        left={<TextInput.Icon color="#FFCA9F" name="email" />}
                        value={email}
                        onChangeText={(email) => setEmail(email)}
                        editable={props.route.params?.barbeiroID==undefined||props.route.params?.barbeiroID==null||props.route.params?.barbeiroID==''}
                    />
                    <HelperText type="error" visible={errors.email !== null ? true : false}>
                        {errors.email}
                    </HelperText>
                    <TextInput
                        style={style.input}
                        mode='flat'
                        activeOutlineColor='#FFCA9F'
                        keyboardType='phone-pad'
                        label="Celular"
                        error={errors.ncelular !== null ? true : false}
                        onFocus={() => handleError(null, 'ncelular')}
                        theme={{ colors: { placeholder: `${ncelular!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                        left={<TextInput.Icon color="#FFCA9F" name="phone" />}
                        value={globalFunction.formataTelefone(ncelular)}
                        onChangeText={(ncelular) => setNcelular(globalFunction.formataTelefone(ncelular))}
                    />
                    <HelperText type="error" visible={errors.ncelular !== null ? true : false}>
                        {errors.ncelular}
                    </HelperText>
                    <TextInput
                        style={style.input}
                        mode='flat'
                        activeOutlineColor='#FFCA9F'
                        keyboardType='numeric'
                        label="CPF"
                        error={errors.cpf !== null ? true : false}
                        onFocus={() => handleError(null, 'cpf')}
                        theme={{ colors: { placeholder: `${cpf!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                        left={<TextInput.Icon color="#FFCA9F" name="account" />}
                        value={globalFunction.formataCPF(cpf)}
                        onChangeText={(cpfField) => setCpf(globalFunction.formataCPF(cpfField))}
                        editable={props.route.params?.barbeiroID==undefined||props.route.params?.barbeiroID==null||props.route.params?.barbeiroID==''}
                    />
                    <HelperText type="error" visible={errors.cpf !== null ? true : false}>
                        {errors.cpf}
                    </HelperText>
                    <TextInput
                        style={style.input}
                        mode='flat'
                        activeOutlineColor='#FFCA9F'
                        label="Especialidade"
                        error={errors.espec !== null ? true : false}
                        onFocus={() => handleError(null, 'espec')}
                        theme={{ colors: { placeholder: `${espec!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                        left={<TextInput.Icon color="#FFCA9F" name="account" />}
                        value={espec}
                        onChangeText={(espec) => setEspec(espec)}
                    />
                    <HelperText type="error" visible={errors.espec !== null ? true : false}>
                        {errors.espec}
                    </HelperText>
                    {props.route.params?.barbeiroID==undefined||props.route.params?.barbeiroID==null||props.route.params?.barbeiroID==''?
                    <>
                        <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#FFCA9F'
                            theme={{ colors: { placeholder: `${senha!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                            label="Nova Senha"
                            error={errors.senha !== null ? true : false}
                            onFocus={() => handleError(null, 'senha')}
                            secureTextEntry={hidePass1}
                            left={<TextInput.Icon color="#FFCA9F" name="lock" />}
                            right={<TextInput.Icon color="#FFCA9F" onPress={() => setHidePass1(!hidePass1)} name={hidePass1 ? "eye-off" : "eye"}></TextInput.Icon>}
                            value={senha}
                            onChangeText={(senha) => setSenha(senha)}
                            />
                        <HelperText HelperText type="error" visible={errors.senha !== null ? true : false}>
                            {errors.senha}
                        </HelperText>
                        <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#FFCA9F'
                            theme={{ colors: { placeholder: `${senhaConfirmed!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                            label="Confirmar Senha"
                            error={errors.senhaConfirmed !== null ? true : false}
                            onFocus={() => handleError(null, 'senhaConfirmed')}
                            secureTextEntry={hidePass2}
                            left={<TextInput.Icon color="#FFCA9F" name="lock" />}
                            right={<TextInput.Icon color="#FFCA9F" onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
                            value={senhaConfirmed}
                            onChangeText={(senhaConfirmed) => setSenhaConfirmed(senhaConfirmed)}
                            />
                        <HelperText type="error" visible={errors.senhaConfirmed !== null ? true : false}>
                            {errors.senhaConfirmed}
                        </HelperText>
                    </>
                    :null}
                <TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={style.button} onPress={() => {!loadingSubmit?handleSubmit():null}}>
                    {loadingSubmit?<ActivityIndicator/>:<Text style={style.textButton}>CONFIRMAR DADOS</Text>}
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
  
  const mapDispatchToProps = dispatch => {
    return {
        onEdit: usuario => dispatch(usuarioLogado(usuario))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DadosBarbeiro);