import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import globalStyles from "../globalStyles";

const Loading = () => {
    return (
        <View style={style.loading}>
            <ActivityIndicator animating={true}/>
        </View>
    )
}

const style = StyleSheet.create({
    loading: {
        backgroundColor: globalStyles.main_color,
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