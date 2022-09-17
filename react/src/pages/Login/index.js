import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, TextInput, View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import style from './style'

const Login = ({ navigation, route }) => {
  const [input, setInput] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [login, setLogin] = useState('');

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
            value= {login}
            onChangeText={ (login) => setLogin(login) }
          />

      <View style={ style.inputAreaSenhaL}>
      <TextInput
          style={ style.inputSenhaL }
          placeholder="Senha"
          placeholderTextColor="#fff" 
          secureTextEntry={hidePass}
          value={input}
          onChangeText={ (texto) => setInput(texto) }
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
        onPress={''}
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