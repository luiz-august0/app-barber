import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, ImageBackground, TextInput, StyleSheet, View, Image } from 'react-native'
import style from './style'
import firebase from 'firebase';

const db = firebase.firestore();

function Home ({ navigation, route }) {
  const usuarioId = firebase.auth().currentUser.uid;
  const [nome, setNome] = useState('');

 

  const getUser = () => {
    firebase
    .firestore()
    .collection('usuarios')
    .doc(usuarioId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        value={nome}
        setNome(doc.data().nome, "nome")
      } else {
        console.log("Não há documento");
      }
  })
}

getUser();

  return (
      <View style={style.container} >
         <Image
          source={require('../img/barbeiro.jpg')}
          style={ style.barberImage }
        />
      <SafeAreaView style={style.safeAreaHeadHome}>
      <TouchableOpacity
      onPress = {() => navigation.navigate('Perfil')}
      >
        <Image
          source={require('../img/barber.png')}
          style={ style.btnPerfil }
        />
      </TouchableOpacity>
      <Text style={{color: '#000', marginTop: -30, marginLeft: 79 ,textAlign: 'left', fontSize: 18, fontWeight: 'bold',}} >Olá, {nome}</Text>
      <Text style={{color: '#000', marginTop: 10, marginLeft: 32 ,textAlign: 'left', fontSize: 14, fontWeight: 'bold',}} >Perfil</Text>
      </SafeAreaView>
      <SafeAreaView style={style.safeAreaH}>
          <TouchableOpacity
          style={ style.btnAgendamento }
          onPress={() => navigation.navigate('Agenda')}
          >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Agendamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={ style.btnConfig }
          onPress={() => navigation.navigate('Config')}
          >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Configuração</Text>
          </TouchableOpacity>

      </SafeAreaView>
  </View>
    ) 
}

export default Home;

