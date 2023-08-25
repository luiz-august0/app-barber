import React, { useContext, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator, Dimensions } from 'react-native'
import { TextInput, HelperText } from "react-native-paper";
import style from './style'
import { createUsuario, postEnviaEmailRecuperacaoSenha, verifyUsuario } from '../../services/api';
import globalStyles from '../../globalStyles';
import globalFunction from '../../globalFunction';
import { connect } from 'react-redux';
import { Context } from '../../contexts/auth';
import { usuarioLogado } from '../../store/actions/usuario';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

const C00 = ({ navigation, route }) => {
  const onClickButton = async (tipoUsuario) => {
    navigation.navigate('C01', { tipoUsuario: tipoUsuario});
  }

  return (
    <View style={[style.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <Image source={require('../../img/barber.png')} style={style.image} />
      <TouchableOpacity
        style={style.button1}
        onPress={() => onClickButton('B')}
      >
        <Text style={style.text}>SOU BARBEIRO</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style.button2}
        onPress={() => onClickButton('C')}
      >
        <Text style={style.text}>SOU CLIENTE</Text>
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
        <SafeAreaView style={style.safeAreaC}>
          <Text style={style.textHeader}>QUEM É VOCÊ?</Text>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#FFCA9F'
            label="Nome"
            error={errors.nome !== null ? true : false}
            onFocus={() => handleError(null, 'nome')}
            theme={{ colors: { placeholder: `${nome!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
            left={<TextInput.Icon color="#FFCA9F" name="account" />}
            value={nome}
            onChangeText={(nome) => setNome(nome)}
          />
          <HelperText type="error" visible={errors.nome !== null ? true : false}>
            {errors.nome}
          </HelperText>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#FFCA9F'
            label="Sobrenome"
            error={errors.snome !== null ? true : false}
            onFocus={() => handleError(null, 'snome')}
            theme={{ colors: { placeholder: `${snome!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
            left={<TextInput.Icon color="#FFCA9F" name="account" />}
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
    const contatoNoMask = globalFunction.formataCampo(ncelular, '000000000000000');

    if (globalFunction.validarEmail(email) === false) {
      handleError("Email inválido", "email");
      isValid = false;
    }

    if (contatoNoMask.length > 0) {
      if (contatoNoMask.length < 11 || contatoNoMask.length > 11) {
        handleError("Número de telefone inválido", "ncelular");
        isValid = false;
      }
    }

    if (route.params?.tipoUsuario === "B" && cpfNoMask === '') {
      handleError("CPF deve ser informado", "cpf");
      isValid = false;
    }

    if (route.params?.tipoUsuario === "B" && cpfNoMask !== '' && !globalFunction.validaCPF(cpfNoMask)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (route.params?.tipoUsuario === "C" && cpfNoMask !== '' && !globalFunction.validaCPF(cpfNoMask)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (isValid) {
      try {
        if (cpfNoMask === "") {
          await verifyUsuario(email.trim(), '');
        } else {
          await verifyUsuario(email.trim(), cpfNoMask);
        }
      } catch (error) {
        isAllowed = false;
        if (error.message === "Request failed with status code 400") {
          handleError('Email já cadastrado', 'email');
        }

        if (error.message === "Request failed with status code 406") {
          handleError('CPF já cadastrado', 'cpf');
        }
      }
    }

    if (isValid && isAllowed) { navigation.navigate('C03', { email: email.trim(), ncelular: ncelular, nome: nome, snome: snome, cpf: cpf, tipoUsuario: route.params?.tipoUsuario }) }
  }

  return (
    <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
      <View style={style.container} >
        <SafeAreaView style={style.safeAreaC}>
          <Text style={style.textHeader}>INFORMAÇÕES PESSOAIS</Text>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#FFCA9F'
            keyboardType='email-address'
            label="Email"
            error={errors.email !== null ? true : false}
            onFocus={() => handleError(null, 'email')}
            theme={{ colors: { placeholder: `${email!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
            left={<TextInput.Icon color="#FFCA9F" name="email" />}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
          <HelperText type="error" visible={errors.email !== null ? true : false}>
            {errors.email}
          </HelperText>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#FFCA9F'
            keyboardType='phone-pad'
            label="Celular"
            error={errors.ncelular !== null ? true : false}
            onFocus={() => handleError(null, 'ncelular')}
            theme={{ colors: { placeholder: `${ncelular!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
            left={<TextInput.Icon color="#FFCA9F" name="phone" />}
            value={globalFunction.formataTelefone(ncelular)}
            onChangeText={(ncelular) => setNcelular(globalFunction.formataTelefone(ncelular))}
          />
          <HelperText type="error" visible={errors.ncelular !== null ? true : false}>
            {errors.ncelular}
          </HelperText>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#FFCA9F'
            keyboardType='number-pad'
            label="CPF"
            error={errors.cpf !== null ? true : false}
            onFocus={() => handleError(null, 'cpf')}
            theme={{ colors: { placeholder: `${cpf!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
            left={<TextInput.Icon color="#FFCA9F" name="account" />}
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

    if (globalFunction.validaSenha(senha).erro) {
      handleError(globalFunction.validaSenha(senha).mensagem, "senha");
      isValid = false;
    }

    if (senha != senhaConfirmed) {
      handleError("Senhas não coincidem, digite novamente", "senhaConfirmed");
      isValid = false;
    }

    if (isValid) {
      navigation.navigate('C04', {
        email: route.params?.email.trim(),
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
        <SafeAreaView style={style.safeAreaC}>
          <Text style={style.textHeader}>CRIE UMA SENHA SEGURA</Text>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#FFCA9F'
            theme={{ colors: { placeholder: `${senha!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
            label="Senha"
            error={errors.senha !== null ? true : false}
            onFocus={() => handleError(null, 'senha')}
            secureTextEntry={hidePass1}
            left={<TextInput.Icon color="#FFCA9F" name="lock" />}
            right={<TextInput.Icon color="#FFCA9F" onPress={() => setHidePass1(!hidePass1)} name={hidePass1 ? "eye-off" : "eye"}></TextInput.Icon>}
            value={senha}
            onChangeText={(senha) => setSenha(senha)}
          />
          <HelperText  type="error" visible={errors.senha !== null ? true : false}>
            {errors.senha}
          </HelperText>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#FFCA9F'
            theme={{ colors: { placeholder: `${senhaConfirmed!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
            label="Confirmar Senha"
            error={errors.senhaConfirmed !== null ? true : false}
            onFocus={() => handleError(null, 'senhaConfirmed')}
            secureTextEntry={hidePass2}
            left={<TextInput.Icon color="#FFCA9F" name="lock" />}
            right={<TextInput.Icon color="#FFCA9F" onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
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
            
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingWrapper>
  )
}

const C04 = (props) => {
  const [nome, setNome] = useState(props.route.params?.nome);
  const [snome, setSnome] = useState(props.route.params?.snome);
  const [email, setEmail] = useState(props.route.params?.email.trim());
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
    const contatoNoMask = globalFunction.formataCampo(ncelular, '000000000000000');

    if (nome == "") {
      handleError("Nome inválido", "nome");
      isValid = false;
    }

    if (snome == "") {
      handleError("Sobrenome inválido", "snome");
      isValid = false;
    }

    if (globalFunction.validarEmail(email) === false) {
      handleError("Email inválido", "email");
      isValid = false;
    }

    if (contatoNoMask.length > 0) {
      if (contatoNoMask.length < 11 || contatoNoMask.length > 11) {
        handleError("Número de telefone inválido", "ncelular");
        isValid = false;
      }
    }

    if (props.route.params?.tipoUsuario === "B" && cpfNoMask === '') {
      handleError("CPF deve ser informado", "cpf");
      isValid = false;
    }

    if (props.route.params?.tipoUsuario === "B" && cpfNoMask !== '' && !globalFunction.validaCPF(cpfNoMask)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (props.route.params?.tipoUsuario === "C" && cpfNoMask !== '' && !globalFunction.validaCPF(cpfNoMask)) {
      handleError("CPF inválido", "cpf");
      isValid = false;
    }

    if (globalFunction.validaSenha(senha).erro) {
      handleError(globalFunction.validaSenha(senha).mensagem, "senha");
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
        await createUsuario(email.trim(), nomeCompleto, senha, contatoNoMask, cpfNoMask, tipo);
        await login(email.trim(), senha).then((resolve) => {
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
          <SafeAreaView style={[style.safeAreaC, {marginTop: 0}]}>
            <Text style={[style.textHeader, { color: '#2B513B' }]}>CONFIRME SEUS DADOS</Text>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#FFCA9F'
              label="Nome"
              error={errors.nome !== null ? true : false}
              onFocus={() => handleError(null, 'nome')}
              theme={{ colors: { placeholder: `${nome!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
              left={<TextInput.Icon color="#FFCA9F" name="account" />}
              value={nome}
              onChangeText={(nome) => setNome(nome)}
            />
            <HelperText  type="error" visible={errors.nome !== null ? true : false}>
              {errors.nome}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#FFCA9F'
              label="Sobrenome"
              error={errors.snome !== null ? true : false}
              onFocus={() => handleError(null, 'snome')}
              theme={{ colors: { placeholder: `${snome!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
              left={<TextInput.Icon color="#FFCA9F" name="account" />}
              value={snome}
              onChangeText={(snome) => setSnome(snome)}
            />
            <HelperText  type="error" visible={errors.snome !== null ? true : false}>
              {errors.snome}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#FFCA9F'
              keyboardType='email-address'
              label="Email"
              error={errors.email !== null ? true : false}
              onFocus={() => handleError(null, 'email')}
              theme={{ colors: { placeholder: `${email!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
              left={<TextInput.Icon color="#FFCA9F" name="email" />}
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
            <HelperText  type="error" visible={errors.email !== null ? true : false}>
              {errors.email}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#FFCA9F'
              keyboardType='phone-pad'
              label="Celular"
              error={errors.ncelular !== null ? true : false}
              onFocus={() => handleError(null, 'ncelular')}
              theme={{ colors: { placeholder: `${ncelular!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
              left={<TextInput.Icon color="#FFCA9F" name="phone" />}
              value={globalFunction.formataTelefone(ncelular)}
              onChangeText={(ncelular) => setNcelular(globalFunction.formataTelefone(ncelular))}
            />
            <HelperText  type="error" visible={errors.ncelular !== null ? true : false}>
              {errors.ncelular}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#FFCA9F'
              keyboardType='numeric'
              label="CPF"
              error={errors.cpf !== null ? true : false}
              onFocus={() => handleError(null, 'cpf')}
              theme={{ colors: { placeholder: `${cpf!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
              left={<TextInput.Icon color="#FFCA9F" name="account" />}
              value={globalFunction.formataCPF(cpf)}
              onChangeText={(cpfField) => setCpf(globalFunction.formataCPF(cpfField))}
            />
            <HelperText  type="error" visible={errors.cpf !== null ? true : false}>
              {errors.cpf}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#FFCA9F'
              theme={{ colors: { placeholder: `${senha!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
              label="Senha"
              error={errors.senha !== null ? true : false}
              onFocus={() => handleError(null, 'senha')}
              secureTextEntry={hidePass1}
              left={<TextInput.Icon color="#FFCA9F" name="lock" />}
              right={<TextInput.Icon color="#FFCA9F" onPress={() => setHidePass1(!hidePass1)} name={hidePass1 ? "eye-off" : "eye"}></TextInput.Icon>}
              value={senha}
              onChangeText={(senha) => setSenha(senha)}
            />
            <HelperText  type="error" visible={errors.senha !== null ? true : false}>
              {errors.senha}
            </HelperText>
            <TextInput
              style={style.inputC}
              mode='flat'
              activeOutlineColor='#FFCA9F'
              theme={{ colors: { placeholder: `${senhaConfirmed!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
              label="Confirmar Senha"
              error={errors.senhaConfirmed !== null ? true : false}
              onFocus={() => handleError(null, 'senhaConfirmed')}
              secureTextEntry={hidePass2}
              left={<TextInput.Icon color="#FFCA9F" name="lock" />}
              right={<TextInput.Icon color="#FFCA9F" onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
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
                source={require('../../img/confirm.png')}
                style={style.imageCadastro}
              />
              
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

    if (globalFunction.validarEmail(email) === false) {
      handleError("Email inválido", "email");
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      try {
        await postEnviaEmailRecuperacaoSenha(email.trim());
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
        <SafeAreaView style={style.safeAreaC}>
          <Text style={[style.textHeader, { color: '#2B513B' }]}>DIGITE O EMAIL DA SUA CONTA</Text>
          <TextInput
            style={style.inputC}
            mode='flat'
            activeOutlineColor='#FFCA9F'
            keyboardType='email-address'
            label="Email"
            error={errors.email !== null ? true : false}
            onFocus={() => handleError(null, 'email')}
            theme={{ colors: { placeholder: `${email!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
            left={<TextInput.Icon color="#FFCA9F" name="email" />}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
          <HelperText  type="error" visible={errors.email !== null ? true : false}>
            {errors.email}
          </HelperText>
          <TouchableOpacity style={[style.btnRedefinir, { backgroundColor: '#2B513B' }]} onPress={() => {!loading?enviaEmail():null}}>
            {!loading?<Text style={{ color: '#FFCA9F', fontFamily: 'Manrope-Regular' }}>ENVIAR</Text>
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