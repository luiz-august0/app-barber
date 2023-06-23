import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import OIcon from 'react-native-vector-icons/Octicons';

const AbsoluteModal = ({children, modalVisible, width, handlePressOut}) => {
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
            <View style={style.centeredView}>
                <View style={[style.modalView]}>
                <TouchableOpacity style={{position: "absolute", right: "110%", padding: 10}} onPress={() => handlePressOut()}>
                    <OIcon 
                    name="x" 
                    size={30} 
                    color={'gray'}
                    />
                </TouchableOpacity>
                    <View style={{marginBottom: 30}} />
                    {children}
                </View>
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        maxHeight: '100%',
        width: '100%',
        backgroundColor: '#ffff',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default AbsoluteModal;