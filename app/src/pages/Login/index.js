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
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const { login, loadUser } = useContext(Context);

  const doLogin = async() => {
    setIsLoadingLogin(true);
    await login(email.trim(), senha).then((resolve) => {
      const data = resolve.dataUsuario;
      if (resolve.authenticated) {
        props.onLogin(data);
        props.navigation.navigate('Home');
      }
    });
    setIsLoadingLogin(false);
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
        await loadUser().then((resolve) => {
          const data = resolve.dataUsuario;
          if (resolve.authenticated) {
            props.onLogin(data);
            props.navigation.navigate('Home');
          } else {
            setIsLoading(false);
          }
        });
      } else {
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
              mode='flat'
              activeOutlineColor='#FFCA9F'
              label="Email"
              keyboardType='email-address'
              theme={{colors: {placeholder: `${email!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F'}}}
              left={<TextInput.Icon color="#FFCA9F" name="email" />}
              value= {email}
              onChangeText={ (email) => setEmail(email) }
          />
          <TextInput
              style={ style.inputL }
              mode='flat'
              activeOutlineColor='#FFCA9F'
              theme={{colors: {placeholder: `${senha!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F'}}}
              label="Senha"
              secureTextEntry={hidePass}
              left={<TextInput.Icon color="#FFCA9F" name="lock"/>}
              right={<TextInput.Icon color="#FFCA9F" onPress={ () => setHidePass(!hidePass) } name={ hidePass ? "eye-off":"eye"}></TextInput.Icon>}
              value= {senha}
              onChangeText={ (senha) => setSenha(senha) }
          />
            <TouchableOpacity
            onPress={() => props.navigation.navigate('RedefinirSenha')}
            >
              <Text style={{ color: "#BA6213", marginTop: 10, fontSize: 14, fontFamily: 'Manrope-Regular' }} >Esqueci a Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={handleSubmit}
            style={ style.btnLogin }
            >
              {!isLoadingLogin?<Text style={{ color: '#FFCA9F', fontFamily: 'Manrope-Regular' }}>LOGIN</Text>:<ActivityIndicator/>}
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={() => props.navigation.navigate('C00')}
            style={style.btnCadastro}
            >
              <Text style={{ color: '#FFCA9F', fontFamily: 'Manrope-Regular' }}>CADASTRE-SE AGORA</Text>
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