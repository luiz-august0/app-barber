import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
        backgroundColor: globalStyles.main_color
    }, 
    text: {
        width: '100%',
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#ffff'
    },
    textCategoria: {
        fontSize: 16,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#BA6213',
    },
    textCategoriaButton: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        bottom: 25,
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#000',
    },
    textTitle: {
        width: '100%',
        fontSize: 24,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#2B513B',
        marginTop: '20%',
        marginBottom: '5%'
    },
    button: {
        justifyContent: 'center',
        marginTop: 55,
        width: 300,
        height: 45,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    },
    categoriaComponent: {
        padding: 9,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#FDEBDD'
    },
    categoriaView: {
        flexDirection: "column"
    },
    categoriaViewButtons: { 
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 30
    },
    buttonCategoriaComponent:{
        justifyContent: "center", 
        alignItems: "center"
    },
    buttonConfirma: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        width: '70%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#BA6213'
    },
    input: {
        marginTop: 10,
        width: '100%',
        height: 55,
        backgroundColor: '#2B513B',
    },
});