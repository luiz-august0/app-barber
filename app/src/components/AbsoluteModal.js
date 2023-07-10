import React from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import OIcon from 'react-native-vector-icons/Octicons';

const AbsoluteModal = ({children, modalVisible, width, handlePressOut}) => {
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
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
            </KeyboardAvoidingView>
        </Modal>
    )
}

const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22
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