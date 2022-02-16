import React, { useState } from 'react'
import { SafeAreaView, TextInput, Text,  TouchableOpacity, View, Image, Alert } from 'react-native'
import style from './style'
import firebase from 'firebase';


function Config ({ navigation, route }) {
    function logOut() {
        firebase.auth().signOut;
        navigation.navigate('Login')
    }
    return (
    <View style={style.container} >
        <SafeAreaView  style={style.safeAreaConfig}>
            <TouchableOpacity 
            style={ style.btnlogOut }
            onPress={logOut} 
            >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Desconectar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    </View>
    
    )
  }
  

  export default Config;