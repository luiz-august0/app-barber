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
        alignItems: "center",
        marginTop: 10
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
        width: 300,
        borderRadius: 5
    },
    separateComponent: {
        width: 300, 
        height: 2, 
        backgroundColor: '#FFF',
        borderRadius: 5
    },
    barbeariaComponent: {
        width: 300, 
        height: 320, 
        marginBottom: 25
    },
    cardBarbearia: {
        backgroundColor: '#BA6213', 
        borderRadius: 5
    },
    textTitleBarbeariaComponent: {
        textAlign: "left", 
        color: '#000', 
        fontFamily: 'Manrope-Bold', 
        fontSize: 24
    },
    textSubtitleBarbeariaComponent: {
        textAlign: "left", 
        color: '#000', 
        fontFamily: 'Manrope-Regular', 
        fontSize: 14
    },
    barbeariaComponentImage: {
        flex: 1,
        borderRadius: 5
    },
    barbeariaButtonComponent: {
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
    viewButtons: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 50
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    },
    textButton: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#FFCA9F'
    },
	input: {
        height: 100,
        width: 250,
		marginLeft: 8,
		marginRight: 8,
		padding: 8,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		color: '#fff',
		backgroundColor: '#000'
	},
})