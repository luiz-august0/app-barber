import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, TextInput, View, Image, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
        <Image
          source={require('../../img/barbeiro.jpg')}
          style={ style.barberImage }
        />
    <SafeAreaView style={ style.safeAreaL } >
      <TextInput
          style={ style.inputL }
          placeholder="E-mail"
          placeholderTextColor="#fff"
          value= {email}
          onChangeText={ (email) => setEmail(email) }
      />

      <View style={ style.inputAreaSenhaL}>
      <TextInput
          style={ style.inputSenhaL }
          placeholder="Senha"
          placeholderTextColor="#fff" 
          secureTextEntry={hidePass}
          value={senha}
          onChangeText={ (texto) => setSenha(texto) }
        /> 
        <TouchableOpacity style={style.iconEye}  onPress={ () => setHidePass(!hidePass) }>
          { hidePass ? 
            <Ionicons name="eye" color="#FFF" size={25} />
            :
            <Ionicons name="eye-off" color="#FFF" size={25} />
          }
        </TouchableOpacity>
      </View>
        
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
        onPress={() => navigation.navigate('C01')}
        style={style.btnCadastro}
        >
        <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Cadastrar agora</Text>
        </TouchableOpacity>
    </SafeAreaView>
  </View>
    ) 
}

export default Login;