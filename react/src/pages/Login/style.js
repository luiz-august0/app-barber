import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    }, 
    safeAreaL: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    barberImage: {
        height: 250,
        width: 350
    },
    inputL: {
        marginTop: 10,
        width: '70%',
        height: 55,
        backgroundColor: '#2B513B',
    },
    btnLogin: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        width: '70%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#BA6213'
    },
    btnCadastro: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: '70%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    }
});