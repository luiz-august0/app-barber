import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, ImageBackground, TextInput, StyleSheet, View, Image, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import style from './style'
import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyDMSAWQf4wIgIxvmZRvtgc8A6sVgVEmFbU",
  authDomain: "aircutapp-83c5a.firebaseapp.com",
  projectId: "aircutapp-83c5a",
  storageBucket: "aircutapp-83c5a.appspot.com",
  messagingSenderId: "781356712087",
  appId: "1:781356712087:web:99c050cebf0df1a03fa9d2",
  measurementId: "G-9F81FWVVD4"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}



export default Login = ({ navigation, route }) => {
  const [input, setInput] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [login, setLogin] = useState('');
  

  function validarLogin() {
    try{
      firebase.auth().signInWithEmailAndPassword(login, input)
        .then(() => navigation.navigate('Home'))
        .catch(error => {   
          Alert.alert("Email ou senha inválidos", "Digite novamente");
       })
     }catch(err){
        Alert.alert("Email ou senha inválidos", "Digite novamente");
     }
    }

    return (
      <View style={ style.container }>
        <Image
          source={require('../img/barbeiro.jpg')}
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
        onPress={() => navigation.navigate('redefinirSenha')}
        >
          <Text style={{ color: "#ffff", marginTop: 10, fontSize: 14, fontWeight: 'bold' }} >Esqueci a Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={validarLogin}
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

