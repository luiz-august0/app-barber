import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import { TextInput } from "react-native-paper";
import { login } from  '../../contexts/auth';
import style from './style'

const Login = ({ navigation, route }) => {
  const [senha, setSenha] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === '' && senha === '') {
      Alert.alert('Email e senha deve ser informado');
      return;
    } 

    login(email, senha).then((resolve) => {
      if (resolve.authenticated) {
        navigation.navigate('Home');
      }
    });
  }

    return (
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
              theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
              left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="email" />}
              value= {email}
              onChangeText={ (email) => setEmail(email) }
          />
          <TextInput
              style={ style.inputL }
              mode='outlined'
              activeOutlineColor='#fff'
              theme={{colors: {placeholder: '#fff', text: 'white', primary: 'white'}}}
              label="Senha"
              secureTextEntry={hidePass}
              left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
              right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass(!hidePass) } name={ hidePass ? "eye-off":"eye"}></TextInput.Icon>}
              value= {senha}
              onChangeText={ (senha) => setSenha(senha) }
          />
            
            <TouchableOpacity
            onPress={() => navigation.navigate('RedefinirSenha')}
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
            onPress={() => navigation.navigate('C00')}
            style={style.btnCadastro}
            >
            <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Cadastrar agora</Text>
            </TouchableOpacity>
        </SafeAreaView>
      </View>
    ) 
}

export default Login;