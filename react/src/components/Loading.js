import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

const Loading = () => {
    return (
        <Modal
        transparent={true}
        >
            <View style={style.loading}>
                <ActivityIndicator animating={true}/>
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Loading;