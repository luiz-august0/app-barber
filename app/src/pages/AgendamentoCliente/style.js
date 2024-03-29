import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
        backgroundColor: globalStyles.main_color
    }, 
    headerView: {
        flex:1, 
        padding: 10, 
        alignItems: 'center',
        marginTop: 40 
    },
    text: {
        fontSize: 16,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    textTitleCliente: {
        fontSize: 22,
        fontFamily: 'Manrope-Bold',
        color: '#BA6213',
    },
    textSubtitleCliente: {
        fontSize: 16,
        fontFamily: 'Manrope-Regular',
        color: '#000',
    },
    button: {
        justifyContent: 'center',
        width: Dimensions.get('window').width / 2.5,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#343434'
    },
    buttonConfirmFilter: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginBottom: 20,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#2B513B'
    },
    buttonFilter: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        height: 50, 
        borderRadius: 20, 
        width: 150, 
        borderColor: '#000',
        borderWidth: 3
    },
    textTitle: {
        fontSize: 22,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#2B513B',
        marginTop: 20
    },
    textSubTitle: {
        fontSize: 22,
        fontFamily: 'Manrope-Bold',
        textAlign: 'left',
        color: '#2B513B',
        marginTop: 20,
        marginBottom: 10
    },
    input: {
        marginTop: 10,
        width: 240,
        height: 55,
        backgroundColor: '#FFCA9F',
        borderWidth: 2,
        borderColor: '#BA6213'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    renderItemCliente: {
        flex:1, 
        flexDirection: "row", 
        marginTop: 20, 
        backgroundColor: '#FDEBDD',
        borderRadius: 20,
        padding: 10,
        alignItems: "center"
    },
    buttonRenderItem: {
        flexDirection: "row",
        alignItems: "center", 
        padding: 5, 
        backgroundColor: '#ffff', 
        borderRadius: 20, 
        marginTop: 10, 
        justifyContent: "center",
        borderWidth: 1,
        borderColor: '#000'
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
        color: '#2B513B',
    },
    categoriaViewButtons: { 
        flexDirection: 'column',
    },
    textCategoriaButton: {
        fontSize: 16,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#000',
    },
    buttonCategoriaComponent:{
        flexDirection: 'row',
        justifyContent: "center", 
        alignItems: "center",
        paddingVertical: 15
    },
});