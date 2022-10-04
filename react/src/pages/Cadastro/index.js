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
  const [errors, setErrors] = React.useState({'nome': null, 'snome': null});

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const validarC = () => {
    let isValid = true;

    if (nome === "") {
      handleError('Nome inválido', 'nome');
      isValid = false;
    }

    if (snome === "") {
      handleError('Sobrenome inválido', 'snome');
      isValid = false;
    }

    if (isValid) {
      navigation.navigate('C02', {nome: nome, snome: snome})
    }
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
          error={errors.nome!==null?true:false}
          onFocus={() => handleError(null, 'nome')}
          theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
          left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
          value= {nome}
          onChangeText={ (nome) => setNome(nome) }
        />
        <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.nome!==null?true:false}>
          {errors.nome}
        </HelperText>
        <TextInput
          style={ style.inputC }
          mode='outlined'
          activeOutlineColor='#fff'
          label="Sobrenome"
          error={errors.snome!==null?true:false}
          onFocus={() => handleError(null, 'snome')}
          theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
          left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
          value= {snome}
          onChangeText={ (snome) => setSnome(snome) }
        />
        <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.snome!==null?true:false}>
          {errors.snome}
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
  const [errors, setErrors] = React.useState({'email': null, 'ncelular': null, 'cpf': null});

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  
  let nome = route.params?.nome;
  let snome = route.params?.snome;

  const validarC2 = async() => {
    let isValid = true;
    let isAllowed = true;

    if (validarEmail(email) === false) {
      handleError("Email inválido", "email");
      isValid = false;
    }

    if (ncelular.length > 0) {
      if (ncelular.length < 11 || ncelular.length > 11) {
        handleError("Número de telefone inválido", "ncelular");
        isValid = false;
      }
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf === '') {
      handleError("CPF deve ser informado", "cpf");
      isValid = false;
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf !== '' && !validaCPF(cpf)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "C" && cpf !== '' && !validaCPF(cpf)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (isValid) {
      try {
        if (cpf === "") {
          await verifyUsuario(email, '');
        } else {
          await verifyUsuario(email, cpf);
        }
      } catch (error) {
          if (error.message === "Request failed with status code 400") {
            handleError('Email já cadastrado', 'email');
            isAllowed = false;
          }
  
          if (error.message === "Request failed with status code 406") {
            handleError('CPF já cadastrado', 'cpf');
            isAllowed = false;
          }
      }
    }
    
    if (isValid && isAllowed) { navigation.navigate('C03', {email: email, ncelular: ncelular, nome: nome, snome: snome, cpf: cpf}) }
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
        error={errors.email!==null?true:false}
        onFocus={() => handleError(null, 'email')}
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="email" />}
        value= {email}
        onChangeText={ (email) => setEmail(email) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.email!==null?true:false}>
        {errors.email}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='phone-pad'
        label="Celular"
        error={errors.ncelular!==null?true:false}
        onFocus={() => handleError(null, 'ncelular')}
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="phone" />}
        value= {ncelular}
        onChangeText={ (ncelular) => setNcelular(ncelular) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.ncelular!==null?true:false}>
        {errors.ncelular}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='numeric'
        label="CPF"
        error={errors.cpf!==null?true:false}
        onFocus={() => handleError(null, 'cpf')}
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
        value= {cpf}
        onChangeText={ (cpf) => setCpf(cpf) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.cpf!==null?true:false}>
        {errors.cpf}
      </HelperText>
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

  const [errors, setErrors] = React.useState({'senha': null, 'senhaConfirmed': null});

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
    
  const validarC3 = () => {
    let isValid = true;

    if (senha.length < 6) {
      handleError("Senha invalida, digite uma senha com no minímo 6 caracteres", "senha");
      isValid = false;
    }

    if (senha != senhaConfirmed) {
      handleError("Senhas não coincidem, digite novamente", "senhaConfirmed");
      isValid = false;
    }

    if (isValid) {
      navigation.navigate('C04',{email: route.params?.email, 
                                ncelular: route.params?.ncelular, 
                                nome: route.params?.nome, 
                                snome: route.params?.snome, 
                                cpf: route.params?.cpf,
                                senha: senha});
    }
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
        error={errors.senha!==null?true:false}
        onFocus={() => handleError(null, 'senha')}
        secureTextEntry={hidePass1}
        left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
        right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass1(!hidePass1) } name={ hidePass1 ? "eye-off":"eye"}></TextInput.Icon>}
        value= {senha}
        onChangeText={ (senha) => setSenha(senha) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.senha!==null?true:false}>
        {errors.senha}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        theme={{colors: {placeholder: '#fff', text: 'white', primary: 'white'}}}
        label="Confirmar Senha"
        error={errors.senhaConfirmed!==null?true:false}
        onFocus={() => handleError(null, 'senhaConfirmed')}
        secureTextEntry={hidePass2}
        left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
        right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass2(!hidePass2) } name={ hidePass2 ? "eye-off":"eye"}></TextInput.Icon>}
        value= {senhaConfirmed}
        onChangeText={ (senhaConfirmed) => setSenhaConfirmed(senhaConfirmed) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.senhaConfirmed!==null?true:false}>
        {errors.senhaConfirmed}
      </HelperText>
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
  const [errors, setErrors] = React.useState({'nome': null, 'snome': null, 'email': null, 'ncelular': null, 'cpf': null, 'senha': null, 'senhaConfirmed': null});

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
    
  const CadastraUsuario = async() => {
    let isValid = true;

    if (nome == "") {
      handleError("Nome inválido", "nome");
      isValid = false;
    }

    if (snome == "") {
      handleError("Sobrenome inválido", "snome");
      isValid = false;
    }

    if (validarEmail(email) === false) {
      handleError("Email inválido", "email");
      isValid = false;
    }

    if (ncelular.length > 0) {
      if (ncelular.length < 11 || ncelular.length > 11) {
        handleError("Número de telefone inválido", "ncelular");
        isValid = false;
      }
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf === '') {
      handleError("CPF deve ser informado", "cpf");
      isValid = false;
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "B" && cpf !== '' && !validaCPF(cpf)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (await AsyncStorage.getItem('TipoUsuario') === "C" && cpf !== '' && !validaCPF(cpf)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (senha.length < 6) {
      handleError("Senha invalida, digite uma senha com no minímo 6 caracteres", "senha");
      isValid = false;
    }

    if (senha != senhaConfirmed) {
      handleError("Senhas não coincidem, digite novamente", "senhaConfirmed");
      isValid = false;
    }

    if (isValid) {
      try {
        let nomeCompleto = nome + ' ' + snome;
        let tipo = await AsyncStorage.getItem('TipoUsuario')
        await createUsuario(email, nomeCompleto, senha, ncelular, cpf, tipo);
        Alert.alert('Usuário cadastrado com sucesso!');
        navigation.navigate('Login');
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

  return (
  <View style={style.container}>
    <SafeAreaView  style={style.safeAreaCfinaliza}>
    <Text style={{color: '#fff', textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold'}} >Confirmar dados</Text>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        label="Nome"
        error={errors.nome!==null?true:false}
        onFocus={() => handleError(null, 'nome')}
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
        value= {nome}
        onChangeText={ (nome) => setNome(nome) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.nome!==null?true:false}>
        {errors.nome}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        label="Sobrenome"
        error={errors.snome!==null?true:false}
        onFocus={() => handleError(null, 'snome')}
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
        value= {snome}
        onChangeText={ (snome) => setSnome(snome) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.snome!==null?true:false}>
        {errors.snome}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='email-address'
        label="Email"
        error={errors.email!==null?true:false}
        onFocus={() => handleError(null, 'email')}
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="email" />}
        value= {email}
        onChangeText={ (email) => setEmail(email) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.email!==null?true:false}>
        {errors.email}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='phone-pad'
        label="Celular"
        error={errors.ncelular!==null?true:false}
        onFocus={() => handleError(null, 'ncelular')}
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="phone" />}
        value= {ncelular}
        onChangeText={ (ncelular) => setNcelular(ncelular) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.ncelular!==null?true:false}>
        {errors.ncelular}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        keyboardType='numeric'
        label="CPF"
        error={errors.cpf!==null?true:false}
        onFocus={() => handleError(null, 'cpf')}
        theme={{colors: {placeholder: 'white', text: 'white', primary: 'white'}}}
        left={<TextInput.Icon color="white"  style={{marginTop: '50%'}} name="account" />}
        value= {cpf}
        onChangeText={ (cpf) => setCpf(cpf) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.cpf!==null?true:false}>
        {errors.cpf}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        theme={{colors: {placeholder: '#fff', text: 'white', primary: 'white'}}}
        label="Senha"
        error={errors.senha!==null?true:false}
        onFocus={() => handleError(null, 'senha')}
        secureTextEntry={hidePass1}
        left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
        right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass1(!hidePass1) } name={ hidePass1 ? "eye-off":"eye"}></TextInput.Icon>}
        value= {senha}
        onChangeText={ (senha) => setSenha(senha) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.senha!==null?true:false}>
        {errors.senha}
      </HelperText>
      <TextInput
        style={ style.inputC }
        mode='outlined'
        activeOutlineColor='#fff'
        theme={{colors: {placeholder: '#fff', text: 'white', primary: 'white'}}}
        label="Confirmar Senha"
        error={errors.senhaConfirmed!==null?true:false}
        onFocus={() => handleError(null, 'senhaConfirmed')}
        secureTextEntry={hidePass2}
        left={<TextInput.Icon color="white" style={{marginTop: '50%'}} name="lock"/>}
        right={<TextInput.Icon color="white" style={{marginTop: '50%'}} onPress={ () => setHidePass2(!hidePass2) } name={ hidePass2 ? "eye-off":"eye"}></TextInput.Icon>}
        value= {senhaConfirmed}
        onChangeText={ (senhaConfirmed) => setSenhaConfirmed(senhaConfirmed) }
      />
      <HelperText style={{marginBottom: '-4%'}} type="error" visible={errors.senhaConfirmed!==null?true:false}>
        {errors.senhaConfirmed}
      </HelperText>
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