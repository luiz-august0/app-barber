import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalStyles.main_color
    }, 
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    textTitle: {
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: 50,
        marginBottom: '5%'
    },
    textButton: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    textViewServico: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: '#ffff',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width / 2.2,
        height: 150,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#343434'
    },
    confirmButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginBottom: 100,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#0096FF'
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
    textCategoria: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'left',
        color: '#ffff',
    },
    categoriaViewButtons: { 
        flexDirection: 'column',
    },
    textCategoriaButton: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        color: '#ffff',
    },
    buttonCategoriaComponent:{
        flexDirection: 'row',
        justifyContent: "center", 
        alignItems: "center",
        paddingVertical: 15
    },
    buttonViewServico: {
        flex: 1,
        width: '100%',
        borderRadius: 20,
        flexDirection: 'row', 
        padding: 10, 
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#343434',
        marginVertical: 10,
    },
    viewButtonServico: {
        maxWidth: Dimensions.get('window').width / 2,
    },
    buttonSelectServico: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center'
    }
});