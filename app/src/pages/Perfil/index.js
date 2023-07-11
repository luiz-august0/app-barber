import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Alert, Image, ActivityIndicator } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import style from "./style";
import { getUsuario, updateUsuario, updateUsuarioPassword, updateUsuarioFoto } from "../../services/api";
import * as ImagePicker from 'expo-image-picker';
import globalStyles from "../../globalStyles";
import globalFunction from "../../globalFunction";
import perfil from "../../img/perfil.png";
import { connect } from "react-redux";
import { usuarioLogado } from "../../store/actions/usuario";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";

const Perfil = (props) => {
    const initialStateErrors = { 'nome': null, 'email': null, 'ncelular': null, 'cpf': null };
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [ncelular, setNcelular] = useState('');
    const [cpf, setCpf] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState(initialStateErrors);
    const [onEditMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const getUsuarioData = async () => {
        const response = getUsuario(props.usuario.state.id);

        if ((props.usuario.state.urlImagem !== 'ul') && (props.usuario.state.urlImagem !== '') && (props.usuario.state.urlImagem !== null)) {
            setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${props.usuario.state.urlImagem}`});
        } else {
            setImage(perfil);
        }

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

        if (props.usuario.state.tipo === "B" && cpfNoMask === '') {
            handleError("CPF deve ser informado", "cpf");
            isValid = false;
        }

        if (props.usuario.state.tipo === "B" && cpfNoMask !== '' && !globalFunction.validaCPF(cpfNoMask)) {
            handleError("CPF inválido", "cpf");
            isValid = false;
        }

        if (props.usuario.state.tipo === "C" && cpfNoMask !== '' && !globalFunction.validaCPF(cpfNoMask)) {
            handleError("CPF inválido", "cpf");
            isValid = false;
        }

        if (isValid) {
            try {
                await updateUsuario(email.trim(), nome, ncelular, cpfNoMask, props.usuario.state.id);
                Alert.alert('Atenção', 'Usuário alterado com sucesso!');
                getUsuarioData();
                updateStoreUsuario();
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
                const responseImage = await updateUsuarioFoto(props.usuario.state.id, file);
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.assets[0].base64});
                updateStoreUsuario();
                setLoading(false);
            } catch (error) {
                Alert.alert('Atenção', 'Ops, ocorreu algum erro ao realizar o upload da imagem' )
                setLoading(false);
            }
        }
        
    }

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
                    style={style.inputC}
                    mode='flat'
                    activeOutlineColor='#FFCA9F'
                    label="Nome"
                    error={errors.nome !== null ? true : false}
                    onFocus={() => handleError(null, 'nome')}
                    theme={{ colors: { placeholder: `${nome!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                    left={<TextInput.Icon color="#FFCA9F" name="account" />}
                    value={nome}
                    onChangeText={(nome) => setNome(nome)}
                    editable={onEditMode}
                />
                <HelperText type="error" visible={errors.nome !== null ? true : false}>
                    {errors.nome}
                </HelperText>
                <TextInput
                    style={style.inputC}
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
                    editable={onEditMode}
                />
                <HelperText type="error" visible={errors.email !== null ? true : false}>
                    {errors.email}
                </HelperText>
                <TextInput
                    style={style.inputC}
                    mode='flat'
                    activeOutlineColor='#FFCA9F'
                    keyboardType='phone-pad'
                    label="Celular"
                    error={errors.ncelular !== null ? true : false}
                    onFocus={() => handleError(null, 'ncelular')}
                    theme={{ colors: { placeholder: `${ncelular!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                    left={<TextInput.Icon color="#FFCA9F" name="phone" />}
                    value={ncelular}
                    onChangeText={(ncelular) => setNcelular(ncelular)}
                    editable={onEditMode}
                />
                <HelperText type="error" visible={errors.ncelular !== null ? true : false}>
                    {errors.ncelular}
                </HelperText>
                <TextInput
                    style={style.inputC}
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
                    editable={onEditMode}
                />
                <HelperText type="error" visible={errors.cpf !== null ? true : false}>
                    {errors.cpf}
                </HelperText>
                <View style={{ marginTop: 35, marginBottom: 60, alignItems: "center" }}>
                    <TouchableOpacity style={style.button} onPress={() => {setEditMode(onEditMode?false:true); {onEditMode?getUsuarioData():null}; {onEditMode?limpaCampos():null};}}>
                        <Text style={{ color: "#FFCA9F", fontSize: 14, fontFamily: 'Manrope-Regular' }}>{onEditMode?'CANCELAR EDIÇÃO':'EDITAR USUÁRIO'}</Text>
                    </TouchableOpacity>
                    {onEditMode?
                        <TouchableOpacity style={[style.button, {backgroundColor: '#2B513B'}]} onPress={() => AtualizaUsuario()}>
                            <Text style={{ color: "#FFCA9F", fontSize: 14, fontFamily: 'Manrope-Regular' }}>CONFIRMAR</Text>
                        </TouchableOpacity>
                    :null}
                    {!onEditMode?
                        <TouchableOpacity style={[style.button, {backgroundColor: '#2B513B', width: 150}]} onPress={() => props.navigation.navigate('EditarSenha', { id: props.usuario.state.id })}>
                            <Text style={{ color: "#FFCA9F", fontSize: 14, fontFamily: 'Manrope-Regular' }}>ALTERAR SENHA</Text>
                        </TouchableOpacity>
                    :null}
                </View>
            </View>
        </KeyboardAvoidingWrapper>
    )
}

const EditarSenha = (props) => {
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

      if (globalFunction.validaSenha(senha).erro) {
        handleError(globalFunction.validaSenha(senha).mensagem, "senha");
        isValid = false;
      }
  
      if (senha != senhaConfirmed) {
        handleError("Senhas não coincidem, digite novamente", "senhaConfirmed");
        isValid = false;
      }
  
      if (isValid) {
        try {
            await updateUsuarioPassword(senhaAntiga, senha, props.route.params?.id);
            Alert.alert('Atenção', 'Senha alterada com sucesso!');
            props.navigation.navigate('Perfil');
        } catch (error) {
            if (error.message === "Request failed with status code 401") {
                handleError('Senha antiga incorreta', 'senhaAntiga');
            }
        }
      }
    }

    return (
        <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.containerPassword} >
                <SafeAreaView style={style.safeAreaC}>
                    <TextInput
                    style={style.inputC}
                    mode='flat'
                    activeOutlineColor='#FFCA9F'
                    theme={{ colors: { placeholder: `${senhaAntiga!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                    label="Senha Antiga"
                    error={errors.senhaAntiga !== null ? true : false}
                    onFocus={() => handleError(null, 'senhaAntiga')}
                    secureTextEntry={hidePass}
                    left={<TextInput.Icon color="#FFCA9F" name="lock" />}
                    right={<TextInput.Icon color="#FFCA9F" onPress={() => setHidePass(!hidePass)} name={hidePass ? "eye-off" : "eye"}></TextInput.Icon>}
                    value={senhaAntiga}
                    onChangeText={(senhaAntiga) => setSenhaAntiga(senhaAntiga)}
                    />
                    <HelperText HelperText type="error" visible={errors.senhaAntiga !== null ? true : false}>
                        {errors.senhaAntiga}
                    </HelperText>
                    <TextInput
                    style={style.inputC}
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
                    style={style.inputC}
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
                    <TouchableOpacity style={[style.button, { marginTop: 35}]} onPress={() => AtualizaSenha()}>
                        <Text style={{ color: "#FFCA9F", fontSize: 14, fontFamily: 'Manrope-Regular' }}>CONFIRMAR</Text>
                    </TouchableOpacity>
                </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Perfil);
export { EditarSenha };