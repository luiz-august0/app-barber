import React from "react";
import { Modal, StyleSheet, View } from "react-native";

const SimpleModal = ({children, modalVisible, handlePressOut}) => {
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
            <View style={style.centeredView}>
                <View style={[style.modalView]}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        maxHeight: '100%',
        width: '100%',
        backgroundColor: '#BA6213',
        borderRadius: 20,
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

export default SimpleModal;