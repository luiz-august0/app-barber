import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
        backgroundColor: globalStyles.main_color
    },
    text: {
        fontSize: 16,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#000'
    }, 
    textTitle: {
        fontSize: 24,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#FFCA9F'
    }, 
    textBarb: {
        maxWidth: Dimensions.get('window').width / 3,
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Manrope-Bold',
        color: '#000',
    }, 
    image: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    headerDetails: {
        backgroundColor: '#BA6213', 
        width: '100%', 
        padding: 20,
        alignItems: "center", 
        justifyContent: "center"
    },
    headerContent: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center"
    },
    headerContentBarbeiro: {
        flexDirection: "row", 
        maxWidth: '60%', 
        borderWidth: 2, 
        borderColor: '#000',
        borderRadius: 50, 
        alignItems: "center"
    },
    componentBarbeiro: {
        marginLeft: 5, 
        alignItems: "center", 
        justifyContent: "center", 
        paddingRight: 20
    },
    viewContent: {
        alignItems: "center", 
        justifyContent: "center", 
        marginTop: 50
    },
    headerSubtitleComponent: {
        padding: 10, 
        backgroundColor: '#BA6213', 
        width: 250
    },
    separateComponent: {
        width: 250, 
        height: 2, 
        backgroundColor: '#FFF'
    }
})