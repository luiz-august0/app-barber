import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator, Dimensions, BackHandler } from 'react-native'
import { TextInput } from "react-native-paper";
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused  } from '@react-navigation/native';
import globalStyles from '../../globalStyles';
import { usuarioLogado } from '../../store/actions/usuario';
import style from './style'
import { Context } from '../../contexts/auth';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

const Login = (props) => {
  const isFocused = useIsFocused();
  const [senha, setSenha] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loadUser } = useContext(Context);

  const doLogin = async() => {
    setIsLoading(true);
    await login(email, senha).then((resolve) => {
      const data = resolve.dataUsuario;
      if (resolve.authenticated) {
        props.onLogin(data);
        props.navigation.navigate('Home');
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === '' && senha === '') {
      Alert.alert('Atenção', 'Email e senha deve ser informado');
      return;
    } 

    doLogin();
  }

  useEffect(() => {
    const onCreate = async() => {
      const usuario = await AsyncStorage.getItem("usuario");
      const token = await AsyncStorage.getItem("token");
  
      if (usuario && token) {
        setIsLoading(true);
        await loadUser().then((resolve) => {
          const data = resolve.dataUsuario;
          if (resolve.authenticated) {
            props.onLogin(data);
            props.navigation.navigate('Home');
          }
        });
        setIsLoading(false);
      } 
    }

    if (isFocused) {
      onCreate();
    }

    const backAction = () => {
      Alert.alert('Atenção', 'Deseja realmente sair do aplicativo?', [
        {
          text: 'Cancelar',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'Sim', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
    );

  return () => backHandler.remove();
  }, [props, isFocused]);

    return (
      <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
        {!isLoading?
        <View style={ style.container }>
        <SafeAreaView style={ style.safeAreaL } >
          <Image
            source={require('../../img/barber.png')}
            style={ style.barberImage }
          />
          <TextInput
              style={ style.inputL }
              mode='outlined'
              activeOutlineColor='#fff'
              label="Email"
              keyboardType='email-address'
              theme={{colors: {placeholder: `${email!==''?"white":"gray"}`, text: 'white', primary: 'white'}}}
              left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="email" />}
              value= {email}
              onChangeText={ (email) => setEmail(email) }
          />
          <TextInput
              style={ style.inputL }
              mode='outlined'
              activeOutlineColor='#fff'
              theme={{colors: {placeholder: `${senha!==''?"white":"gray"}`, text: 'white', primary: 'white'}}}
              label="Senha"
              secureTextEntry={hidePass}
              left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
              right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass(!hidePass) } name={ hidePass ? "eye-off":"eye"}></TextInput.Icon>}
              value= {senha}
              onChangeText={ (senha) => setSenha(senha) }
          />
            <TouchableOpacity
            onPress={() => props.navigation.navigate('RedefinirSenha')}
            >
              <Text style={{ color: "#ffff", marginTop: 10, fontSize: 14, fontWeight: 'bold' }} >Esqueci a Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={handleSubmit}
            style={ style.btnLogin }
            >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>

            <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }} >Não tem cadastro ?</Text>

            <TouchableOpacity 
            onPress={() => props.navigation.navigate('C00')}
            style={style.btnCadastro}
            >
            <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Cadastrar agora</Text>
            </TouchableOpacity>
        </SafeAreaView>
        </View>
        :<ActivityIndicator style={{marginTop: Dimensions.get('window').height / 2}}/>}
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
      onLogin: usuario => dispatch(usuarioLogado(usuario))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);