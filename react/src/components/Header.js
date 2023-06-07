import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    TouchableOpacity
} from 'react-native';
import icon from "../img/imgMenu.png";
import perfil from "../img/perfil.png";
import { connect } from 'react-redux';

const Header = (props) => {

    return (
        <View style={styles.container}>
            {((props.usuario.state.urlImagem !== 'ul') && (props.usuario.state.urlImagem !== '') && (props.usuario.state.urlImagem !== null))?
            <Image source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${props.usuario.state.urlImagem}`}} style={styles.avatar}/>
            :<Image source={perfil} style={styles.avatar}/>}
            <Text style={styles.user}>{props.usuario.state.nome}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    user: {
        fontSize: 22,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        color: '#000',
        marginTop: 10
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50
    }
})

const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}

export default connect(mapStateToProps, null)(Header);