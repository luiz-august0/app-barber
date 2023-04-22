import React, { useContext, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator, Dimensions } from 'react-native'
import { TextInput, HelperText } from "react-native-paper";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import style from './style'
import { createUsuario, postEnviaEmailRecuperacaoSenha, verifyUsuario } from '../../services/api';
import imgChair from '../../img/chair.png';
import globalStyles from '../../globalStyles';
import globalFunction from '../../globalFunction';
import { connect } from 'react-redux';
import { Context } from '../../contexts/auth';
import { usuarioLogado } from '../../store/actions/usuario';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

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
    navigation.navigate('C01', { tipoUsuario: tipoUsuario});
  }

  return (
    <View style={[style.container, { alignItems: 'center' }]}>
      <Image source={imgChair} style={style.image} />
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
  const [errors, setErrors] = useState({ 'nome': null, 'snome': null });

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
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
      navigation.navigate('C02', { nome: nome, snome: snome, tipoUsuario: route.params?.tipoUsuario })
    }
  }

  return (
    <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
      <View style={style.container} >
        <Text style={{ color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold' }}>Quem é você ?</Text>
        <SafeAreaView style={style.safeAreaC}>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#fff'
            label="Nome"
            error={errors.nome !== null ? true : false}
            onFocus={() => handleError(null, 'nome')}
            theme={{ colors: { placeholder: `${nome!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
            left={<TextInput.Icon color="white" name="account" />}
            value={nome}
            onChangeText={(nome) => setNome(nome)}
          />
          <HelperText type="error" visible={errors.nome !== null ? true : false}>
            {errors.nome}
          </HelperText>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#fff'
            label="Sobrenome"
            error={errors.snome !== null ? true : false}
            onFocus={() => handleError(null, 'snome')}
            theme={{ colors: { placeholder: `${snome!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
            left={<TextInput.Icon color="white" name="account" />}
            value={snome}
            onChangeText={(snome) => setSnome(snome)}
          />
          <HelperText type="error" visible={errors.snome !== null ? true : false}>
            {errors.snome}
          </HelperText>
          <TouchableOpacity
            style={style.btnCadastro}
            onPress={validarC}
          >
            <Image
              source={require('../../img/next-button.png')}
              style={style.imageCadastro}
            />
            <Text>Avançar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingWrapper>
  )
}

const C02 = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [ncelular, setNcelular] = useState('');
  const [cpf, setCpf] = useState('');
  const [errors, setErrors] = useState({ 'email': null, 'ncelular': null, 'cpf': null });

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  let nome = route.params?.nome;
  let snome = route.params?.snome;

  const validarC2 = async () => {
    let isValid = true;
    let isAllowed = true;
    const cpfNoMask = globalFunction.formataCampo(cpf, '00000000000');

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

    if (route.params?.tipoUsuario === "B" && cpfNoMask === '') {
      handleError("CPF deve ser informado", "cpf");
      isValid = false;
    }

    if (route.params?.tipoUsuario === "B" && cpfNoMask !== '' && !validaCPF(cpfNoMask)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (route.params?.tipoUsuario === "C" && cpfNoMask !== '' && !validaCPF(cpfNoMask)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (isValid) {
      try {
        if (cpfNoMask === "") {
          await verifyUsuario(email, '');
        } else {
          await verifyUsuario(email, cpfNoMask);
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

    if (isValid && isAllowed) { navigation.navigate('C03', { email: email, ncelular: ncelular, nome: nome, snome: snome, cpf: cpf, tipoUsuario: route.params?.tipoUsuario }) }
  }

  return (
    <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
      <View style={style.container} >
        <Text style={{ color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold' }}>Informações pessoais</Text>
        <SafeAreaView style={style.safeAreaC}>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#fff'
            keyboardType='email-address'
            label="Email"
            error={errors.email !== null ? true : false}
            onFocus={() => handleError(null, 'email')}
            theme={{ colors: { placeholder: `${email!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
            left={<TextInput.Icon color="white" name="email" />}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
          <HelperText type="error" visible={errors.email !== null ? true : false}>
            {errors.email}
          </HelperText>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#fff'
            keyboardType='phone-pad'
            label="Celular"
            error={errors.ncelular !== null ? true : false}
            onFocus={() => handleError(null, 'ncelular')}
            theme={{ colors: { placeholder: `${ncelular!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
            left={<TextInput.Icon color="white" name="phone" />}
            value={ncelular}
            onChangeText={(ncelular) => setNcelular(ncelular)}
          />
          <HelperText type="error" visible={errors.ncelular !== null ? true : false}>
            {errors.ncelular}
          </HelperText>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#fff'
            keyboardType='number-pad'
            label="CPF"
            error={errors.cpf !== null ? true : false}
            onFocus={() => handleError(null, 'cpf')}
            theme={{ colors: { placeholder: `${cpf!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
            left={<TextInput.Icon color="white" name="account" />}
            value={globalFunction.formataCPF(cpf)}
            onChangeText={(cpfField) => setCpf(globalFunction.formataCPF(cpfField))}
          />
          <HelperText type="error" visible={errors.cpf !== null ? true : false}>
            {errors.cpf}
          </HelperText>
          <TouchableOpacity
            style={style.btnCadastro}
            onPress={validarC2}
          >
            <Image
              source={require('../../img/next-button.png')}
              style={style.imageCadastro}
            />
            <Text>Avançar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingWrapper>
  )
}

const C03 = ({ navigation, route }) => {
  const [senha, setSenha] = useState('');
  const [hidePass1, setHidePass1] = useState(true);
  const [senhaConfirmed, setSenhaConfirmed] = useState('');
  const [hidePass2, setHidePass2] = useState(true);

  const [errors, setErrors] = useState({ 'senha': null, 'senhaConfirmed': null });

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
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
      navigation.navigate('C04', {
        email: route.params?.email,
        ncelular: route.params?.ncelular,
        nome: route.params?.nome,
        snome: route.params?.snome,
        cpf: route.params?.cpf,
        senha: senha,
        tipoUsuario: route.params?.tipoUsuario
      });
    }
  }

  return (
    <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
      <View style={style.container} >
        <Text style={{ color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold' }}>Crie uma senha segura</Text>
        <SafeAreaView style={style.safeAreaC}>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#fff'
            theme={{ colors: { placeholder: `${senha!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
            label="Senha"
            error={errors.senha !== null ? true : false}
            onFocus={() => handleError(null, 'senha')}
            secureTextEntry={hidePass1}
            left={<TextInput.Icon color="white" name="lock" />}
            right={<TextInput.Icon color="white" onPress={() => setHidePass1(!hidePass1)} name={hidePass1 ? "eye-off" : "eye"}></TextInput.Icon>}
            value={senha}
            onChangeText={(senha) => setSenha(senha)}
          />
          <HelperText  type="error" visible={errors.senha !== null ? true : false}>
            {errors.senha}
          </HelperText>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#fff'
            theme={{ colors: { placeholder: `${senhaConfirmed!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
            label="Confirmar Senha"
            error={errors.senhaConfirmed !== null ? true : false}
            onFocus={() => handleError(null, 'senhaConfirmed')}
            secureTextEntry={hidePass2}
            left={<TextInput.Icon color="white" name="lock" />}
            right={<TextInput.Icon color="white" onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
            value={senhaConfirmed}
            onChangeText={(senhaConfirmed) => setSenhaConfirmed(senhaConfirmed)}
          />
          <HelperText  type="error" visible={errors.senhaConfirmed !== null ? true : false}>
            {errors.senhaConfirmed}
          </HelperText>
          <TouchableOpacity
            style={style.btnCadastro}
            onPress={validarC3}
          >
            <Image
              source={require('../../img/next-button.png')}
              style={style.imageCadastro}
            />
            <Text>Avançar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingWrapper>
  )
}

const C04 = (props) => {
  const [nome, setNome] = useState(props.route.params?.nome);
  const [snome, setSnome] = useState(props.route.params?.snome);
  const [email, setEmail] = useState(props.route.params?.email);
  const [ncelular, setNcelular] = useState(props.route.params?.ncelular);
  const [cpf, setCpf] = useState(props.route.params?.cpf);
  const [senha, setSenha] = useState(props.route.params?.senha);
  const [hidePass1, setHidePass1] = useState(true);
  const [senhaConfirmed, setSenhaConfirmed] = useState(props.route.params?.senha);
  const [hidePass2, setHidePass2] = useState(true);
  const [errors, setErrors] = useState({ 'nome': null, 'snome': null, 'email': null, 'ncelular': null, 'cpf': null, 'senha': null, 'senhaConfirmed': null });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(Context);

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  const CadastraUsuario = async () => {
    let isValid = true;
    const cpfNoMask = globalFunction.formataCampo(cpf, '00000000000');

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

    if (props.route.params?.tipoUsuario === "B" && cpfNoMask === '') {
      handleError("CPF deve ser informado", "cpf");
      isValid = false;
    }

    if (props.route.params?.tipoUsuario === "B" && cpfNoMask !== '' && !validaCPF(cpfNoMask)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (props.route.params?.tipoUsuario === "C" && cpfNoMask !== '' && !validaCPF(cpfNoMask)) {
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
      setLoading(true);
      try {
        let nomeCompleto = nome + ' ' + snome;
        let tipo = props.route.params?.tipoUsuario;
        await createUsuario(email, nomeCompleto, senha, ncelular, cpfNoMask, tipo);
        await login(email, senha).then((resolve) => {
          const data = resolve.dataUsuario;
          if (resolve.authenticated) {
            props.onLogin(data);
            props.navigation.navigate('Home');
          }
        });
        Alert.alert('Atenção', 'Usuário cadastrado com sucesso!');
      } catch (error) {
        if (error.message === "Request failed with status code 400") {
          handleError('Email já cadastrado', 'email');
        }

        if (error.message === "Request failed with status code 406") {
          handleError('CPF já cadastrado', 'cpf');
        }
      }
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
      <View style={style.container}>
        {!loading?
          <SafeAreaView style={style.safeAreaCfinaliza}>
            <Text style={{ color: '#000', textAlign: 'center', fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold' }} >Confirmar dados</Text>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#fff'
              label="Nome"
              error={errors.nome !== null ? true : false}
              onFocus={() => handleError(null, 'nome')}
              theme={{ colors: { placeholder: `${nome!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
              left={<TextInput.Icon color="white" name="account" />}
              value={nome}
              onChangeText={(nome) => setNome(nome)}
            />
            <HelperText  type="error" visible={errors.nome !== null ? true : false}>
              {errors.nome}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#fff'
              label="Sobrenome"
              error={errors.snome !== null ? true : false}
              onFocus={() => handleError(null, 'snome')}
              theme={{ colors: { placeholder: `${snome!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
              left={<TextInput.Icon color="white" name="account" />}
              value={snome}
              onChangeText={(snome) => setSnome(snome)}
            />
            <HelperText  type="error" visible={errors.snome !== null ? true : false}>
              {errors.snome}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#fff'
              keyboardType='email-address'
              label="Email"
              error={errors.email !== null ? true : false}
              onFocus={() => handleError(null, 'email')}
              theme={{ colors: { placeholder: `${email!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
              left={<TextInput.Icon color="white" name="email" />}
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
            <HelperText  type="error" visible={errors.email !== null ? true : false}>
              {errors.email}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#fff'
              keyboardType='phone-pad'
              label="Celular"
              error={errors.ncelular !== null ? true : false}
              onFocus={() => handleError(null, 'ncelular')}
              theme={{ colors: { placeholder: `${ncelular!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
              left={<TextInput.Icon color="white" name="phone" />}
              value={ncelular}
              onChangeText={(ncelular) => setNcelular(ncelular)}
            />
            <HelperText  type="error" visible={errors.ncelular !== null ? true : false}>
              {errors.ncelular}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#fff'
              keyboardType='numeric'
              label="CPF"
              error={errors.cpf !== null ? true : false}
              onFocus={() => handleError(null, 'cpf')}
              theme={{ colors: { placeholder: `${cpf!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
              left={<TextInput.Icon color="white" name="account" />}
              value={globalFunction.formataCPF(cpf)}
              onChangeText={(cpfField) => setCpf(globalFunction.formataCPF(cpfField))}
            />
            <HelperText  type="error" visible={errors.cpf !== null ? true : false}>
              {errors.cpf}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#fff'
              theme={{ colors: { placeholder: `${senha!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
              label="Senha"
              error={errors.senha !== null ? true : false}
              onFocus={() => handleError(null, 'senha')}
              secureTextEntry={hidePass1}
              left={<TextInput.Icon color="white" name="lock" />}
              right={<TextInput.Icon color="white" onPress={() => setHidePass1(!hidePass1)} name={hidePass1 ? "eye-off" : "eye"}></TextInput.Icon>}
              value={senha}
              onChangeText={(senha) => setSenha(senha)}
            />
            <HelperText  type="error" visible={errors.senha !== null ? true : false}>
              {errors.senha}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#fff'
              theme={{ colors: { placeholder: `${senhaConfirmed!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
              label="Confirmar Senha"
              error={errors.senhaConfirmed !== null ? true : false}
              onFocus={() => handleError(null, 'senhaConfirmed')}
              secureTextEntry={hidePass2}
              left={<TextInput.Icon color="white" name="lock" />}
              right={<TextInput.Icon color="white" onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
              value={senhaConfirmed}
              onChangeText={(senhaConfirmed) => setSenhaConfirmed(senhaConfirmed)}
            />
            <HelperText  type="error" visible={errors.senhaConfirmed !== null ? true : false}>
              {errors.senhaConfirmed}
            </HelperText>
            <TouchableOpacity
              style={style.btnCadastro}
              onPress={CadastraUsuario}
            >
              <Image
                source={require('../../img/next-button.png')}
                style={style.imageCadastro}
              />
              <Text>Avançar</Text>
            </TouchableOpacity>
          </SafeAreaView>
        :<ActivityIndicator style={{marginTop: Dimensions.get('window').height / 2}}/>}
      </View>
    </KeyboardAvoidingWrapper>
  )
}

const RedefinirSenha = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ 'email': null });
  const [loading, setLoading] = useState(false);

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  const enviaEmail = async() => {
    let isValid = true;

    if (validarEmail(email) === false) {
      handleError("Email inválido", "email");
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      try {
        await postEnviaEmailRecuperacaoSenha(email);
        Alert.alert('Atenção', 'Email de redefinição de senha enviado com sucesso!');
        navigation.navigate('Login');
      } catch (error) {
        console.log(error)
        if (error.message === "Request failed with status code 404") {
          handleError("Email informado não existe cadastro", "email");
        }
        if (error.message === "Request failed with status code 400") {
          Alert.alert('Erro', 'Não foi possível enviar o e-mail');
        }
      }
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
      <View style={style.container} >
        <Text style={{ color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold', }} >Redefinição de senha</Text>
        <SafeAreaView style={style.safeAreaC}>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#fff'
            keyboardType='email-address'
            label="Email"
            error={errors.email !== null ? true : false}
            onFocus={() => handleError(null, 'email')}
            theme={{ colors: { placeholder: `${email!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
            left={<TextInput.Icon color="white" name="email" />}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
          <HelperText  type="error" visible={errors.email !== null ? true : false}>
            {errors.email}
          </HelperText>
          <TouchableOpacity style={[style.btnRedefinir, { backgroundColor: !loading?'#05A94E':'gray' }]} onPress={() => {!loading?enviaEmail():null}}>
            {!loading?<Text style={{ color: '#fff', fontWeight: 'bold'}}>Enviar</Text>
            :<ActivityIndicator/>}
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingWrapper>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: usuario => dispatch(usuarioLogado(usuario))
  }
}

export default connect(null, mapDispatchToProps)(C04);
export { C00, C01, C02, C03, RedefinirSenha };