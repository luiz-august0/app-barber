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
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 40 
    },
    itemsView: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 10
    },
    text: {
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#FFCA9F'
    },
    standardText: {
        color: '#FFCA9F', 
        fontFamily: 'Manrope-Regular'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width / 2.2,
        height: 45,
        borderRadius: 5,
        backgroundColor: '#BA6213'
    },
    buttonConfirmFilter: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginBottom: 20,
        width: 200,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    },
    item: {
        width: 160, 
        alignItems: "center", 
        justifyContent: "center",
        marginVertical: 10
    },
    contentItem: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#2B513B',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonFilter: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        width: Dimensions.get('window').width / 2.2,
        height: 45,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#BA6213'
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
        width: 250,
        height: 55,
        backgroundColor: '#2B513B',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
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
    modalFiltersView: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },
    contentItemStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        gap: 3,
        marginTop: 10
    },
    statusComponent: {
        width: 20, 
        height: 20,
        borderRadius: 100
    },
    buttonConfirmDate: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-evenly", 
        width: Dimensions.get('window').width / 2.2,
        height: 45,
        borderRadius: 5,
        backgroundColor: '#2B513B'
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
});