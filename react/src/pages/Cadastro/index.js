import React, { useState } from 'react'
import { SafeAreaView, TextInput, Text,  TouchableOpacity, View, Image, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import style from './style'
import { createUsuario } from '../../services/api';

function C01 ({ navigation, route })  {
  const [nome, setNome] = useState('');
  const [snome, setSnome] = useState('');

  function validarC() {
    if (nome == "" && snome == "") {
      Alert.alert("Nome e Sobrenome invalidos", "Por favor, digite novamente");
    }
    else if (nome == "") {
      Alert.alert("Nome invalido", "Por favor, digite novamente");
    }
    else if (snome == "") {
      Alert.alert("Sobrenome invalido", "Por favor, digite novamente");
    }
    else {
      navigation.navigate('C02', {nome: nome, snome: snome})
    }
  }
  
    return (
        <View style={style.container} >
        <Text style={{color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Quem é você ?</Text>
        <SafeAreaView style={style.safeAreaC }>
            <TextInput
            style={ style.inputC}
            placeholder="Nome"
            placeholderTextColor="#fff" 
            value= {nome}
            onChangeText={ (nome) => setNome(nome) }
        />
        <TextInput
            style={ style.inputC }
            placeholder="Sobrenome"
            placeholderTextColor="#fff" 
            value= {snome}
            onChangeText={ (snome) => setSnome(snome) }
        />
        <TouchableOpacity 
        onPress={validarC}
        >
          <Image
            source={require('../../img/next-button.png')}
            style={ style.btnNext }
          />
        </TouchableOpacity>

        </SafeAreaView>
    </View>
    )
  
}

function C02 ({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [ncelular, setNcelular] = useState('');
  
  let nome = route.params?.nome;
  let snome = route.params?.snome;

  function validarEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function validarC2(){
    if (validarEmail(email) === false) {
      Alert.alert("Email invalido", "Por favor, digite novamente");
    }
    else if (ncelular.length > 0) {
      if (ncelular.length < 11 || ncelular.length > 11) {
        Alert.alert("Número de telefone invalido", "Por favor, digite novamente");
      }
    }
    else {
      navigation.navigate('C03', {email: email, ncelular: ncelular, nome: nome, snome: snome})
    }
  }

  return (
      <View style={style.container} >
      <Text style={{color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Informações de contato</Text>
      <SafeAreaView style={style.safeAreaC}>
          <TextInput
          keyboardType="email-address"
          style={ style.inputC }
          placeholder="E-mail"
          placeholderTextColor="#fff"
          value= {email}
          onChangeText={ (email) => setEmail(email) }

      />
      <TextInput
          keyboardType="phone-pad"
          style={ style.inputC }
          placeholder="Celular"
          placeholderTextColor="#fff" 
          value= {ncelular}
          onChangeText={ (ncelular) => setNcelular(ncelular) }
      />
      <TouchableOpacity
      onPress={validarC2}
      >
        <Image
          source={require('../../img/next-button.png')}
          style={ style.btnNext }
        />
      </TouchableOpacity>

      </SafeAreaView>
  </View>
  
  )
}

function C03 ({ navigation, route })  {
  const [input1, setInput1] = useState('');
  const [hidePass1, setHidePass1] = useState(true);

  const [input2, setInput2] = useState('');
  const [hidePass2, setHidePass2] = useState(true);
    
  const validarC3 = async() => {
    const tipo = await AsyncStorage.getItem("TipoUsuario");

    if (input1.length < 6) {
      Alert.alert("Senha invalida", "Por favor, digite uma senha com no minímo 6 caracteres");
    }
    else if (input1 != input2) {
      Alert.alert("Senhas não coincidem", "Por favor, digite novamente");
    }
    else {
      try {
        await createUsuario(route.params?.email, route.params?.nome + ' ' + route.params?.nome, input1, route.params?.ncelular, "", tipo);
        Alert.alert('Cadastrado com sucesso!');
        navigation.navigate('Login');
      } catch (error) {
        if (error.message === 'Request failed with status code 401') {
          Alert.alert('Email já cadastrado', 'Informe outro e-mail');
        }
      }
    }
  }

  return (
      <View style={style.container} >
      <Text style={{color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Crie uma senha segura</Text>
          <SafeAreaView  style={style.safeAreaC}>
              <View style={ style.inputAreaSenhaC}>
                  <TextInput
                  style={ style.inputSenhaC }
                  placeholder="Senha"
                  placeholderTextColor="#fff" 
                  secureTextEntry={hidePass1}
                  value={input1}
                  onChangeText={ (texto1) => setInput1(texto1) }
                  /> 
                  <TouchableOpacity style={style.iconEye}  onPress={ () => setHidePass1(!hidePass1) }>
                  { hidePass1 ? 
                      <Ionicons name="eye" color="#FFF" size={25} />
                      :
                      <Ionicons name="eye-off" color="#FFF" size={25} />
                  }
              
                  </TouchableOpacity>
                  </View>

                  <View style={ style.inputAreaSenhaC}>
                  <TextInput
                  style={ style.inputSenhaC }
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#fff" 
                  secureTextEntry={hidePass2}
                  value={input2}
                  onChangeText={ (texto2) => setInput2(texto2) }
                  /> 
                  <TouchableOpacity style={style.iconEye}  onPress={ () => setHidePass2(!hidePass2) }>
                  { hidePass2 ? 
                      <Ionicons name="eye" color="#FFF" size={25} />
                      :
                      <Ionicons name="eye-off" color="#FFF" size={25} />
                  }
              
                  </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                  style={style.btnCadastrar}
                  onPress={validarC3}
                  >
                      <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Cadastrar</Text>
                  </TouchableOpacity>
          </SafeAreaView>
  </View>
  )
 
}

function RedefinirSenha ({ navigation, route }) {
  const [email, setEmail] = useState('');

  function validarEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function validarInputEmail(){
    if (validarEmail(email) === false) {
      Alert.alert("Email invalido", "Por favor, digite novamente");
    }
    else {

    }
  }
  
 
  return (
      <View style={style.container} >
      <Text style={{color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Redefinição de senha</Text>
      <SafeAreaView style={style.safeAreaC}>
          <TextInput
          keyboardType="email-address"
          style={ style.inputC }
          placeholder="Email"
          placeholderTextColor="#fff"
          value= {email}
          onChangeText={ (email) => setEmail(email) }

      />

      <TouchableOpacity 
      style={ style.btnRedefinir }
      onPress={validarInputEmail} 
      >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Redefinir</Text>
      </TouchableOpacity>

      </SafeAreaView>
  </View>
  
  )
}

export { C01, C02, C03, RedefinirSenha };