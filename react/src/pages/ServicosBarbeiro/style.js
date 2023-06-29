import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native'
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
        fontSize: 18,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#ffff',
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
    textButton: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    textViewServico: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Manrope-Bold',
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
        marginTop: 25,
        marginBottom: 100,
        width: '70%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    },
    categoriaComponent: {
        justifyContent: 'center',
        padding: 9,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#FDEBDD'
    },
    categoriaView: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    textCategoria: {
        fontSize: 16,
        fontFamily: 'Manrope-Bold',
        textAlign: 'left',
        color: '#BA6213',
    },
    categoriaViewButtons: { 
        flexDirection: 'column',
    },
    textCategoriaButton: {
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#2B513B',
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
        backgroundColor: '#BA6213',
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