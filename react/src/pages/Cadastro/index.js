import React, { useState } from 'react'
import { SafeAreaView, Text,  TouchableOpacity, View, Image, Alert } from 'react-native'
import { TextInput, HelperText } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cpf as cpfValidator} from 'cpf-cnpj-validator'; 
import style from './style'
import { createUsuario, verifyUsuario } from '../../services/api';
import imgChair from '../../img/chair.png';

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

const C00 = ({ navigation, route }) => {
  const onClickButton = async (tipoUsuario) => {
      await AsyncStorage.setItem("TipoUsuario", tipoUsuario);
      navigation.navigate('C01');
  }

  return (
  <View style={[style.container, {alignItems: 'center'}]}>
      <Image source={imgChair} style={style.image}/>
      <Text style={style.text_title}>Barber</Text>
      <TouchableOpacity
      style={style.button1}
      onPress={() => onClickButton('B')}
      >
          <Text style={style.text}>Sou Barbeiro</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={style.button2}
      onPress={() => onClickButton('C')}
      >
          <Text style={style.text}>Sou Cliente</Text>
      </TouchableOpacity>
  </View>
  ) 
}

const C01 = ({ navigation, route }) => {
  const [nome, setNome] = useState('');
  const [snome, setSnome] = useState('');
  const [errorNome, SetErrorNome] = useState(false);
  const [errorSnome, SetErrorSnome] = useState(false);

  const validarC = () => {
    if (nome === "" && snome === "") {
      return (SetErrorNome(true), SetErrorSnome(true));
    }

    if (nome === "") {
      return (SetErrorNome(true), SetErrorSnome(false));
    }

    if (snome === "") {
      return (SetErrorSnome(true), SetErrorNome(false));
    }

    navigation.navigate('C02', {nome: nome, snome: snome})
    SetErrorNome(false);
    SetErrorSnome(false);
  }
  
    return (
    <View style={style.container} >
      <Text style={{color: '#fff', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold'}}>Quem é você ?</Text>
      <SafeAreaView style={style.safeAreaC }>
        <TextInput
          style={ style.inputC }
          mode='outlined'
          activeOutlineColor='#fff'
          label="Nome"
          error={errorNome}
          onFocus={() => SetErrorNome(false)}
          theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
          left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
          value= {nome}
          onChangeText={ (nome) => setNome(nome) }
        />
        <HelperText type="error" visible={errorNome}>
          Nome inválido
        </HelperText>
        <TextInput
          style={ style.inputC }
          mode='outlined'
          activeOutlineColor='#fff'
          label="Sobrenome"
          error={errorSnome}
          onFocus={() => SetErrorSnome(false)}
          theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
          left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
          value= {snome}
          onChangeText={ (snome) => setSnome(snome) }
        />
        <HelperText type="error" visible={errorSnome}>
          Sobrenome inválido
        </HelperText>
        <TouchableOpacity 
          onPress={validarC}
        >
          <Image
            source={require('../../img/next-button.png')}
            style={ style.btnCadastro }
          />
          <Text style={{marginTop: '-5%'}}>Avançar</Text>
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

  const validarC2 = async() => {
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

    try {
      if (cpf === "") {
        await verifyUsuario(email, '');
      } else {
        await verifyUsuario(email, cpf);
      }
    } catch (error) {
        if (error.message === "Request failed with status code 400") {
          Alert.alert('Email já cadastrado', 'Informe outro email');
          return;
        }

        if (error.message === "Request failed with status code 406") {
          Alert.alert('CPF já cadastrado', 'Informe outro CPF');
          return;
        }
    }
    
    navigation.navigate('C03', {email: email, ncelular: ncelular, nome: nome, snome: snome, cpf: cpf});
  }

  return (
  <View style={style.container} >
    <Text style={{color: '#fff', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold'}}>Informações pessoais</Text>
    <SafeAreaView style={style.safeAreaC}>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='email-address'
        label="Email"
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="email" />}
        value= {email}
        onChangeText={ (email) => setEmail(email) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='phone-pad'
        label="Celular"
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="phone" />}
        value= {ncelular}
        onChangeText={ (ncelular) => setNcelular(ncelular) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='numeric'
        label="CPF"
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
        value= {cpf}
        onChangeText={ (cpf) => setCpf(cpf) }
      />
      <TouchableOpacity
      onPress={validarC2}
      >
      <Image
        source={require('../../img/next-button.png')}
        style={ style.btnCadastro }
      />
        <Text style={{marginTop: '-5%'}}>Avançar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  </View>
  )
}

const C03 = ({ navigation, route }) => {
  const [senha, setSenha] = useState('');
  const [hidePass1, setHidePass1] = useState(true);

  const [senhaConfirmed, setSenhaConfirmed] = useState('');
  const [hidePass2, setHidePass2] = useState(true);
    
  const validarC3 = () => {
    if (senha.length < 6) {
      Alert.alert("Senha invalida", "Por favor, digite uma senha com no minímo 6 caracteres");
      return;
    }

    if (senha != senhaConfirmed) {
      Alert.alert("Senhas não coincidem", "Por favor, digite novamente");
      return;
    }

    navigation.navigate('C04',{email: route.params?.email, 
                              ncelular: route.params?.ncelular, 
                              nome: route.params?.nome, 
                              snome: route.params?.snome, 
                              cpf: route.params?.cpf,
                              senha: senha});
  }

  return (
  <View style={style.container} >
    <Text style={{color: '#fff', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold'}}>Crie uma senha segura</Text>
    <SafeAreaView  style={style.safeAreaC}>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        theme={{colors: {placeholder: '#fff', text: 'white', primary: 'white'}}}
        label="Senha"
        secureTextEntry={hidePass1}
        left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
        right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass1(!hidePass1) } name={ hidePass1 ? "eye-off":"eye"}></TextInput.Icon>}
        value= {senha}
        onChangeText={ (senha) => setSenha(senha) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        theme={{colors: {placeholder: '#fff', text: 'white', primary: 'white'}}}
        label="Confirmar Senha"
        secureTextEntry={hidePass2}
        left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
        right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass2(!hidePass2) } name={ hidePass2 ? "eye-off":"eye"}></TextInput.Icon>}
        value= {senhaConfirmed}
        onChangeText={ (senhaConfirmed) => setSenhaConfirmed(senhaConfirmed) }
      />
      <TouchableOpacity
      onPress={validarC3}
      >
      <Image
        source={require('../../img/next-button.png')}
        style={ style.btnCadastro }
      />
        <Text style={{marginTop: '-5%'}}>Avançar</Text>
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
  const [senha, setSenha] = useState(route.params?.senha);
  const [hidePass1, setHidePass1] = useState(true);
  const [senhaConfirmed, setSenhaConfirmed] = useState(route.params?.senha);
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

    if (senha.length < 6) {
      Alert.alert("Senha invalida", "Por favor, digite uma senha com no minímo 6 caracteres");
      return;
    }

    if (senha != senhaConfirmed) {
      Alert.alert("Senhas não coincidem", "Por favor, digite novamente");
      return;
    }

    try {
      let nomeCompleto = nome + ' ' + snome;
      let tipo = await AsyncStorage.getItem('TipoUsuario')
      await createUsuario(email, nomeCompleto, senha, ncelular, cpf, tipo);
      Alert.alert('Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      if (error.message === "Request failed with status code 400") {
        Alert.alert('Email já cadastrado', 'Informe outro email');
      }

      if (error.message === "Request failed with status code 406") {
        Alert.alert('CPF já cadastrado', 'Informe outro CPF');
      }
    }
  }

  return (
  <View style={style.container}>
    <SafeAreaView  style={style.safeAreaCfinaliza}>
    <Text style={{color: '#fff', textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold'}} >Confirmar dados</Text>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        label="Nome"
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
        value= {nome}
        onChangeText={ (nome) => setNome(nome) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        label="Sobrenome"
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
        value= {snome}
        onChangeText={ (snome) => setSnome(snome) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='email-address'
        label="Email"
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="email" />}
        value= {email}
        onChangeText={ (email) => setEmail(email) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='phone-pad'
        label="Celular"
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="phone" />}
        value= {ncelular}
        onChangeText={ (ncelular) => setNcelular(ncelular) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='numeric'
        label="CPF"
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
        value= {cpf}
        onChangeText={ (cpf) => setCpf(cpf) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        theme={{colors: {placeholder: '#fff', text: 'white', primary: 'white'}}}
        label="Senha"
        secureTextEntry={hidePass1}
        left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
        right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass1(!hidePass1) } name={ hidePass1 ? "eye-off":"eye"}></TextInput.Icon>}
        value= {senha}
        onChangeText={ (senha) => setSenha(senha) }
      />
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        theme={{colors: {placeholder: '#fff', text: 'white', primary: 'white'}}}
        label="Confirmar Senha"
        secureTextEntry={hidePass2}
        left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
        right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass2(!hidePass2) } name={ hidePass2 ? "eye-off":"eye"}></TextInput.Icon>}
        value= {senhaConfirmed}
        onChangeText={ (senhaConfirmed) => setSenhaConfirmed(senhaConfirmed) }
      />
      <TouchableOpacity
      onPress={CadastraUsuario}
      >
      <Image
        source={require('../../img/confirm.png')}
        style={ style.btnCadastro }
      />
      </TouchableOpacity>
        <Text style={{marginTop: '-5%'}}>Confirmar dados</Text>
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

export { C00, C01, C02, C03, C04, RedefinirSenha };