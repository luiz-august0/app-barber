import React from "react";
import { Modal, StyleSheet, View } from "react-native";

const AbsoluteModal = ({children, modalVisible, width}) => {
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
            <View style={style.centeredView}>
                <View style={[style.modalView, { width: width }]}>
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
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#ffff',
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

export default AbsoluteModal;