import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image, ActivityIndicator, Dimensions } from "react-native";
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

        if (nome == "") {
            handleError("Nome inválido", "nome");
            isValid = false;
        }

        if (globalFunction.validarEmail(email) === false) {
            handleError("Email inválido", "email");
            isValid = false;
        }

        if (ncelular.length > 0) {
            if (ncelular.length < 11 || ncelular.length > 11) {
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
                    await updateUsuario(email.trim(), nome, ncelular, cpfNoMask, props.route.params?.barbeiroID);
                    await updateBarbeiro(props.route.params?.barbeariaID, props.route.params?.barbeiroID, espec);
                    if (props.route.params?.barbeiroID.toString() == props.usuario.state.id.toString()) {
                        updateStoreUsuario();
                    }
                    Alert.alert('Atenção', 'Barbeiro alterado com sucesso');
                } else {
                    const response = await createUsuario(email.trim(), nome, senha, ncelular, cpfNoMask, 'F');
                    const data = response.data;
                    await postBarbeiro(props.route.params?.barbeariaID, data.insertId, espec);
                    if (image.base64 !== undefined) {
                        const file = `data:${image.type}/jpeg;base64,${image.base64}`;
                        await updateUsuarioFoto(data.insertId, file);
                    }
                    Alert.alert('Atenção', 'Barbeiro cadastrado com sucesso');
                }
                props.navigation.navigate('Barbeiros', { barbeariaID: props.route.params?.barbeariaID });
            } catch (error) {
                if (error.message === "Request failed with status code 400") {
                    handleError('Email já cadastrado', 'email');
                }

                if (error.message === "Request failed with status code 406") {
                    handleError('CPF já cadastrado', 'cpf');
                }
            }
            setLoadingSubmit(false);
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
                if (props.route.params?.barbeiroID!==undefined&&props.route.params?.barbeiroID!==null&&props.route.params?.barbeiroID!=='') {
                    const responseImage = await updateUsuarioFoto(props.route.params?.barbeiroID, file);
                    setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.base64});
                } else {
                    setImage({uri: res.uri, base64: res.base64});
                }
                setLoading(false);
            } catch (error) {
                Alert.alert('Atenção', 'Ops, ocorreu algum erro ao realizar o upload da imagem, contate o suporte' );
                setLoading(false);
            }
        }
        
    }

    return (
        <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                {loadingData?<Loading/>:null}
                <Text style={style.textTitle}>Dados do Barbeiro</Text>
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
                    activeOutlineColor='#fff'
                    label="Nome"
                    error={errors.nome !== null ? true : false}
                    onFocus={() => handleError(null, 'nome')}
                    theme={{ colors: { placeholder: `${nome!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" name="account" />}
                    value={nome}
                    onChangeText={(nome) => setNome(nome)}
                />
                <HelperText type="error" visible={errors.nome !== null ? true : false}>
                    {errors.nome}
                </HelperText>
                <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#fff'
                    keyboardType='email-address'
                    label="Email"
                    error={errors.email !== null ? true : false}
                    onFocus={() => handleError(null, 'email')}
                    theme={{ colors: { placeholder: `${email!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" name="email" />}
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
                    activeOutlineColor='#fff'
                    keyboardType='phone-pad'
                    label="Celular"
                    error={errors.ncelular !== null ? true : false}
                    onFocus={() => handleError(null, 'ncelular')}
                    theme={{ colors: { placeholder: `${ncelular!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" name="phone" />}
                    value={ncelular}
                    onChangeText={(ncelular) => setNcelular(ncelular)}
                />
                <HelperText type="error" visible={errors.ncelular !== null ? true : false}>
                    {errors.ncelular}
                </HelperText>
                <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#fff'
                    keyboardType='numeric'
                    label="CPF"
                    error={errors.cpf !== null ? true : false}
                    onFocus={() => handleError(null, 'cpf')}
                    theme={{ colors: { placeholder: `${cpf!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" name="account" />}
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
                    activeOutlineColor='#fff'
                    label="Especialidade"
                    error={errors.espec !== null ? true : false}
                    onFocus={() => handleError(null, 'espec')}
                    theme={{ colors: { placeholder: `${espec!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                    left={<TextInput.Icon color="white" name="account" />}
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
                        activeOutlineColor='#fff'
                        theme={{ colors: { placeholder: `${senha!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                        label="Nova Senha"
                        error={errors.senha !== null ? true : false}
                        onFocus={() => handleError(null, 'senha')}
                        secureTextEntry={hidePass1}
                        left={<TextInput.Icon color="white" name="lock" />}
                        right={<TextInput.Icon color="white" onPress={() => setHidePass1(!hidePass1)} name={hidePass1 ? "eye-off" : "eye"}></TextInput.Icon>}
                        value={senha}
                        onChangeText={(senha) => setSenha(senha)}
                        />
                    <HelperText HelperText type="error" visible={errors.senha !== null ? true : false}>
                        {errors.senha}
                    </HelperText>
                    <TextInput
                        style={style.input}
                        mode='flat'
                        activeOutlineColor='#fff'
                        theme={{ colors: { placeholder: `${senhaConfirmed!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                        label="Confirmar Senha"
                        error={errors.senhaConfirmed !== null ? true : false}
                        onFocus={() => handleError(null, 'senhaConfirmed')}
                        secureTextEntry={hidePass2}
                        left={<TextInput.Icon color="white" name="lock" />}
                        right={<TextInput.Icon color="white" onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
                        value={senhaConfirmed}
                        onChangeText={(senhaConfirmed) => setSenhaConfirmed(senhaConfirmed)}
                        />
                    <HelperText type="error" visible={errors.senhaConfirmed !== null ? true : false}>
                        {errors.senhaConfirmed}
                    </HelperText>
                </>
                :null}
                <TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={[style.button, {backgroundColor: loadingSubmit?'gray':'#05A94E'}]} onPress={() => {!loadingSubmit?handleSubmit():null}}>
                    {loadingSubmit?<ActivityIndicator/>:<Text style={[ style.textButton, { color: "#fff", fontSize: 14 }]}>Confirmar dados</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingWrapper>
    )
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