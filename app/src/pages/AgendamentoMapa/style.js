import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1
    }, 
    map: {
        width: '100%',
        height: '100%',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10
    },
    imageCallout: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    marker: {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center"
    },
    renderItemBarbearia: {
        padding: 10,
        margin: -50,
        alignItems: "center",
        justifyContent: 'center',
    },
    textTitleBarb: {
        fontSize: 22,
        fontFamily: 'Manrope-Bold',
        color: '#BA6213',
    },
    textSubtitleBarb: {
        fontSize: 16,
        fontFamily: 'Manrope-Regular',
        color: '#000',
    },
});