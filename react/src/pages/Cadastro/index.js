import React, { useState } from 'react'
import { SafeAreaView, TextInput, Text,  TouchableOpacity, View, Image, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cpf as cpfValidator} from 'cpf-cnpj-validator'; 
import { Ionicons } from "@expo/vector-icons";
import style from './style'
import { createUsuario } from '../../services/api';

const validarEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validaCPF = (cpf) => {
  if (cpfValidator.isValid(cpf)) {
    return true;
  } else {
    return false;
  }
};

const C01 = ({ navigation, route }) => {
  const [nome, setNome] = useState('');
  const [snome, setSnome] = useState('');

  const validarC = () => {
    if (nome == "" && snome == "") {
      Alert.alert("Nome e Sobrenome inválidos", "Por favor, digite novamente");
      return;
    }

    if (nome == "") {
      Alert.alert("Nome inválido", "Por favor, digite novamente");
      return;
    }

    if (snome == "") {
      Alert.alert("Sobrenome inválido", "Por favor, digite novamente");
      return;
    }
    navigation.navigate('C02', {nome: nome, snome: snome})
  }
  
    return (
    <View style={style.container} >
      <Text style={{color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Quem é você ?</Text>
      <SafeAreaView style={style.safeAreaC }>
        <TextInput
          style={ style.inputC}
          placeholder="Nome"
          placeholderTextColor="gray" 
          value= {nome}
          onChangeText={ (nome) => setNome(nome) }
          />
        <TextInput
          style={ style.inputC }
          placeholder="Sobrenome"
          placeholderTextColor="gray" 
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

const C02 = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [ncelular, setNcelular] = useState('');
  const [cpf, setCpf] = useState('');
  
  let nome = route.params?.nome;
  let snome = route.params?.snome;

  const validarC2  = async() => {
    if (validarEmail(email) === false) {
      Alert.alert("Email inválido", "Por favor, digite novamente");
      return;
    }

    if (ncelular.length > 0) {
      if (ncelular.length < 11 || ncelular.length > 11) {
        Alert.alert("Número de telefone inválido", "Por favor, digite novamente");
        return;
      }
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf === '') {
      Alert.alert("CPF deve ser informado", "Por favor, informe seu CPF");
      return;
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf !== '' && !validaCPF(cpf)) {
      Alert.alert("CPF inválido", "Por favor, digite novamente");
      return;
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "C" && cpf !== '' && !validaCPF(cpf)) {
      Alert.alert("CPF inválido", "Por favor, digite novamente");
      return;
    }
    
    navigation.navigate('C03', {email: email, ncelular: ncelular, nome: nome, snome: snome, cpf: cpf});
  }

  return (
  <View style={style.container} >
    <Text style={{color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Informações pessoais</Text>
    <SafeAreaView style={style.safeAreaC}>
      <TextInput
        keyboardType="email-address"
        style={ style.inputC }
        placeholder="E-mail"
        placeholderTextColor="gray"
        value= {email}
        onChangeText={ (email) => setEmail(email) }
      />
      <TextInput
        keyboardType="phone-pad"
        style={ style.inputC }
        placeholder="Celular"
        placeholderTextColor="gray" 
        value= {ncelular}
        onChangeText={ (ncelular) => setNcelular(ncelular) }
      />
      <TextInput
        keyboardType="numeric"
        style={ style.inputC }
        placeholder="CPF"
        placeholderTextColor="gray" 
        value= {cpf}
        onChangeText={ (cpf) => setCpf(cpf) }
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

const C03 = ({ navigation, route }) => {
  const [input1, setInput1] = useState('');
  const [hidePass1, setHidePass1] = useState(true);

  const [input2, setInput2] = useState('');
  const [hidePass2, setHidePass2] = useState(true);
    
  const validarC3 = () => {
    if (input1.length < 6) {
      Alert.alert("Senha invalida", "Por favor, digite uma senha com no minímo 6 caracteres");
      return;
    }

    if (input1 != input2) {
      Alert.alert("Senhas não coincidem", "Por favor, digite novamente");
      return;
    }

    navigation.navigate('C04',{email: route.params?.email, 
                              ncelular: route.params?.ncelular, 
                              nome: route.params?.nome, 
                              snome: route.params?.snome, 
                              cpf: route.params?.cpf,
                              senha: input1});
  }

  return (
  <View style={style.container} >
    <Text style={{color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Crie uma senha segura</Text>
    <SafeAreaView  style={style.safeAreaC}>
      <View style={ style.inputAreaSenhaC}>
        <TextInput
        style={ style.inputSenhaC }
        placeholder="Senha"
        placeholderTextColor="gray" 
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
        placeholderTextColor="gray" 
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
      onPress={validarC3}
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

const C04 = ({ navigation, route }) => {
  const [nome, setNome] = useState(route.params?.nome);
  const [snome, setSnome] = useState(route.params?.snome);
  const [email, setEmail] = useState(route.params?.email);
  const [ncelular, setNcelular] = useState(route.params?.ncelular);
  const [cpf, setCpf] = useState(route.params?.cpf);
  const [input1, setInput1] = useState(route.params?.senha);
  const [hidePass1, setHidePass1] = useState(true);
  const [input2, setInput2] = useState(route.params?.senha);
  const [hidePass2, setHidePass2] = useState(true);
    
  const CadastraUsuario = async() => {
    if (nome == "" && snome == "") {
      Alert.alert("Nome e Sobrenome inválidos", "Por favor, digite novamente");
      return;
    }

    if (nome == "") {
      Alert.alert("Nome inválido", "Por favor, digite novamente");
      return;
    }

    if (snome == "") {
      Alert.alert("Sobrenome inválido", "Por favor, digite novamente");
      return;
    }

    if (validarEmail(email) === false) {
      Alert.alert("Email inválido", "Por favor, digite novamente");
      return;
    }

    if (ncelular.length > 0) {
      if (ncelular.length < 11 || ncelular.length > 11) {
        Alert.alert("Número de telefone inválido", "Por favor, digite novamente");
        return;
      }
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf === '') {
      Alert.alert("CPF deve ser informado", "Por favor, informe seu CPF");
      return;
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf !== '' && !validaCPF(cpf)) {
      Alert.alert("CPF inválido", "Por favor, digite novamente");
      return;
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "C" && cpf !== '' && !validaCPF(cpf)) {
      Alert.alert("CPF inválido", "Por favor, digite novamente");
      return;
    }

    if (input1.length < 6) {
      Alert.alert("Senha invalida", "Por favor, digite uma senha com no minímo 6 caracteres");
      return;
    }

    if (input1 != input2) {
      Alert.alert("Senhas não coincidem", "Por favor, digite novamente");
      return;
    }

    try {
      let nomeCompleto = nome + ' ' + snome;
      let tipo = await AsyncStorage.getItem('TipoUsuario')
      await createUsuario(email, nomeCompleto, input1, ncelular, cpf, tipo);
      Alert.alert('Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        Alert.alert('Email já cadastrado', 'Informe outro email');
      }
    }
  }

  return (
  <View style={style.container}>
    <SafeAreaView  style={style.safeAreaCfinaliza}>
    <Text style={{color: '#000', textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Confirmar dados</Text>
      <TextInput
        style={ style.inputC}
        placeholder="Nome"
        placeholderTextColor="gray" 
        value= {nome}
        onChangeText={ (nome) => setNome(nome) }
        />
      <TextInput
        style={ style.inputC }
        placeholder="Sobrenome"
        placeholderTextColor="gray" 
        value= {snome}
        onChangeText={ (snome) => setSnome(snome) }
      />
      <TextInput
          keyboardType="email-address"
          style={ style.inputC }
          placeholder="E-mail"
          placeholderTextColor="gray"
          value= {email}
          onChangeText={ (email) => setEmail(email) }
        />
      <TextInput
          keyboardType="phone-pad"
          style={ style.inputC }
          placeholder="Celular"
          placeholderTextColor="gray" 
          value= {ncelular}
          onChangeText={ (ncelular) => setNcelular(ncelular) }
        />
      <TextInput
          keyboardType="numeric"
          style={ style.inputC }
          placeholder="CPF"
          placeholderTextColor="gray" 
          value= {cpf}
          onChangeText={ (cpf) => setCpf(cpf) }
        />
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
      onPress={CadastraUsuario}
      >
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Cadastrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  </View>
  )
}

const RedefinirSenha = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
 
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

export { C01, C02, C03, C04, RedefinirSenha };