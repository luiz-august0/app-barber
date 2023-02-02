import React, { useEffect, useState } from 'react';
import { Gravatar } from 'react-native-gravatar';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    TouchableOpacity
} from 'react-native';
import icon from "../img/imgMenu.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({navigation, route}) => {
    const [nome, setNome] = useState('')

    const getNome = async() => {
        setNome(JSON.parse(await AsyncStorage.getItem('usuario')).nome);
    }

    useEffect(() => {
        getNome();
    }, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <Image source={icon} style={styles.image}/>
            </View>
            <TouchableOpacity style={styles.userContainer} onPress={() => navigation.navigate('Perfil')}>
                <Text style={styles.user}>{nome}</Text>
                <Gravatar options={{ email: 'luizmarques@rhedesistemas.com.br', secure: true }}
                style={styles.avatar}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#BBB',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    title: {
        color: '#000',
        fontFamily: 'shelter',
        height: 30,
        fontSize: 28
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    user: {
        fontSize: 10,
        color: '#ffff'
    },
    avatar: {
        width: 30,
        height: 30,
        marginLeft: 10
    }
})

export default Header;