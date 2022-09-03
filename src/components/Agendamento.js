import React, { useState } from 'react'
import { SafeAreaView, Platform, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import style from './style'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

  function Agenda ({navigation, route}) {
    const [barbeiro, setBarber] = useState('');
    const [servico, setServ] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');

  function validarAgendamento() {
    if (barbeiro === "" && servico === "" && hora === "" && data === "") {
        Alert.alert("","Não há agendamentos para este usuário")
    } else {
        navigation.navigate('MeusAgendamentos')
    }
  
  }
    
    return (
      <View style={style.container}>
        <View style={style.imageView}>
          <Image
            source={require('../img/barber.png')}
            style={ style.imgAgendamento }
          />
        </View>
        <SafeAreaView style={style.safeAreaAgendamento}>
          <TouchableOpacity
            style={ style.btnAgendar }
            onPress={() => navigation.navigate('AgendaBarbeiro')}
            >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ style.btnMeusAgendamentos }
            onPress={validarAgendamento}
            >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Meus Agendamentos</Text>
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  function AgendaBarbeiro ({ navigation, route }) {
    const [BarberSel, setBarberSel] = useState('Unknown');

    function validarSelecao() {
      if (BarberSel === "Unknown" || BarberSel === "") {
        Alert.alert("Barbeiro não selecionado", "Por favor, selecione um Barbeiro")
      }
      else {
        Alert.alert("", BarberSel + " "+ "Selecionado")
        navigation.navigate('AgendaServico', {BarberSel: BarberSel})
      }
    }
    return(
      <View style={style.container} >
        <View style={{marginTop: 120, width: "80%", height: "7%", padding:5, backgroundColor: "#000", borderRadius:10, alignSelf:"center"}}>
          <Text style={{color: '#ffff', textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Escolha seu Barbeiro</Text>
        </View>
      <SafeAreaView style={style.safeAreaAgendamento}>
        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 18, marginBottom: 10, }}>Selecione um Barbeiro</Text>
        <Picker
          style={style.Picker}
          onValueChange={(value, index) => setBarberSel(value)}
        >
          <Picker.Item label="Selecione um Barbeiro" value=""/>
          <Picker.Item label="José da Silva" value="José da Silva" />
          <Picker.Item label="Luiz Augusto Marques" value="Luiz Augusto Marques" />
        </Picker>
        <TouchableOpacity 
          style={ style.btnSelecionar }
          onPress={validarSelecao} 
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Selecionar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
    )
  }

  function AgendaServico ({ navigation, route }) {
    const [ServSel, setServSel] = useState('Unknown');

    let BarberSel = route.params?.BarberSel;

    function validarSelecao() {
      if (ServSel === "Unknown" || ServSel === "") {
        Alert.alert("Serviço não selecionado", "Por favor, selecione um Serviço")
      }
      else {
        Alert.alert("", ServSel+ " "+ "Selecionado")
        navigation.navigate('AgendaHorario', {ServSel: ServSel, BarberSel: BarberSel})
      }
    }
    return(
      <View style={style.container} >
        <View style={{marginTop: 120, width: "70%", height: "7%", padding:5, backgroundColor: "#ffff", borderRadius:10, alignSelf:"center"}}>
          <Text style={{color: '#000', textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Escolha o Serviço</Text>
        </View>
      <SafeAreaView style={style.safeAreaAgendamento}>
      <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 18, marginBottom: 10, }}>Selecione um Serviço</Text>
        <Picker
          style={style.Picker}
          onValueChange={(value, index) => setServSel(value)}
        >
          <Picker.Item label="Selecione um Serviço" value="" />
          <Picker.Item label="Corte simples - R$20" value="Corte simples - R$20" />
          <Picker.Item label="Barba - R$15" value="Barba - R$15" />
        </Picker>
        <TouchableOpacity 
          style={ style.btnSelecionar }
          onPress={validarSelecao} 
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Selecionar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
    )
  }

  function AgendaHorario ({ navigation, route }) {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const dia = date.getDate().toString()
  const ano = date.getFullYear().toString()
  const mes = date.getMonth().toString()
  const hora = date.getHours().toString()
  const minutos = date.getMinutes().toString()
  const data = dia+"/"+mes+"/"+ano
  const horario = hora+":"+minutos

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  function validaHorario() {
    if (date < Date.now()) {
      Alert.alert("Agendamento invalido","Selecione outro horário")
    } else {
      Alert.alert("", "Agendamento realizado com sucesso!")
      navigation.navigate('Agenda')
    }
  }

    return(
      <View style={style.container} >
        <Text style={{color: '#000', marginTop: 120, textAlign: 'center', fontSize: 27, fontWeight: 'bold',}} >Escolha o horário</Text>
        <SafeAreaView style={style.safeAreaAgendamento}>
          <TouchableOpacity 
            onPress={showDatepicker}
            style={style.btnSelecionarData}
          >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Selecionar data</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={style.btnSelecionarData}
            onPress={showTimepicker} 
          >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Selecionar horário</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={ style.btnFinalizarAgenda }          
            onPress={validaHorario}
          >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Agendar</Text>
          </TouchableOpacity>
        </SafeAreaView>
        {show && (
          <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          />
          )}
    </View>
    )
  }

  

  export {Agenda, AgendaBarbeiro, AgendaServico, AgendaHorario};