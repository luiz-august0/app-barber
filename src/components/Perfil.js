import React, { useState } from 'react'
import { SafeAreaView, TextInput, Text,  TouchableOpacity, View, Image, Alert } from 'react-native'
import style from './style'
import firebase from 'firebase';





function Perfil ({ navigation, route }) {
  const usuarioId = firebase.auth().currentUser.uid;
  const [nome, setNome] = useState('');
  const [sobrenome, setSnome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  

 

  const getUser = () => {
    firebase
    .firestore()
    .collection('usuarios')
    .doc(usuarioId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        value={nome}
        value={sobrenome}
        value={celular}
        value={email}
        setNome(doc.data().nome, "nome")
        setCelular(doc.data().celular, "celular")
        setEmail(doc.data().email, "email")
        setSnome(doc.data().sobrenome, "sobrenome")
      } else {
        console.log("No such document!");
      }
  })
}

getUser();

  
    return (
    <View style={style.container} >
        <SafeAreaView  style={style.safeAreaPerfilImg}>
          <Image
            source={require('../img/perfil.png')}
            style={ style.imgPerfil }
          />
          <Text style={{color: '#000', marginTop: 20, textAlign: 'center', fontSize: 28, fontWeight: 'bold',}} >{nome + " " + sobrenome}</Text>
        </SafeAreaView>
        <SafeAreaView style={style.safeAreaP}>
        <Text style={{color: '#000', marginTop: 20, marginLeft: 25 , textAlign: 'left', fontSize: 16, fontWeight: 'bold',}} >Celular:  {<Text style={{color: '#000', marginTop: 5, marginLeft: 25, marginBottom: 10, textAlign: 'left', fontSize: 20, fontWeight: 'bold',}} >{celular}</Text>}</Text>
        <Text style={{color: '#000', marginTop: 20, marginLeft: 25, textAlign: 'left', fontSize: 16, fontWeight: 'bold',}} >E-mail:  {<Text style={{color: '#000', marginTop: 5, marginLeft: 25, marginBottom: 10, textAlign: 'left', fontSize: 20, fontWeight: 'bold',}} >{email}</Text>}</Text>
        </SafeAreaView>
    </View>
    
    )
  }
  

  export default Perfil;