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
        alignItems: 'center',
        marginTop: 40 
    },
    textTitle: {
        fontSize: 22,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#2B513B',
        marginTop: 20
    },
    text: {
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#BA6213'
    },
    buttonDate: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-evenly", 
        width: Dimensions.get('window').width / 2.2,
        height: 45,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#BA6213'
    },
    buttonConfirm: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-evenly", 
        width: Dimensions.get('window').width / 2.2,
        height: 45,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    },
});