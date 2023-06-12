import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalStyles.main_color
    }, 
    text: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    textCategoria: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'left',
        color: '#ffff',
    },
    textCategoriaButton: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        color: '#ffff',
    },
    textTitle: {
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: '20%',
        marginBottom: '5%'
    },
    button: {
        justifyContent: 'center',
        marginTop: 55,
        width: 300,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#343434'
    },
    categoriaComponent: {
        justifyContent: 'center',
        padding: 9,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#343434'
    },
    categoriaView: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    categoriaViewButtons: { 
        flexDirection: 'column',
    },
    buttonCategoriaComponent:{
        flexDirection: 'row',
        justifyContent: "center", 
        alignItems: "center",
        paddingVertical: 15
    },
    buttonConfirma: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: 110,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#05A94E'
    },
    input: {
        marginTop: 10,
        width: '100%',
        height: 55,
        backgroundColor: '#404040',
    },
});