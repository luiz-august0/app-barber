import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import { TextInput, HelperText } from 'react-native-paper';
import globalStyles from "../../globalStyles";
import style from "./style";
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

const DadosServico = () => {
    const [state, setState] = useState({'nome': null, 'valor': null, 'duracao': '15'});
    const [errors, setErrors] = useState({'nome': null, 'valor': null, 'duracao': null});

    const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    useEffect(() => {

    }, []);

    return (
        <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                <TextInput
                style={style.input}
                mode='flat'
                activeOutlineColor='#fff'
                label="Nome"
                error={errors.nome !== null ? true : false}
                onFocus={() => handleError(null, 'nome')}
                theme={{ colors: { placeholder: `${state.nome!==null&&state.nome!==''?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" name="content-cut" />}
                value={state.nome}
                onChangeText={(nome) => setValueState('nome', nome)}
                />
                <HelperText type="error" visible={errors.nome !== null ? true : false}>
                    {errors.nome}
                </HelperText>
                <TextInput
                style={style.input}
                mode='flat'
                activeOutlineColor='#fff'
                label="Valor"
                keyboardType="decimal-pad"
                error={errors.valor !== null ? true : false}
                onFocus={() => handleError(null, 'valor')}
                theme={{ colors: { placeholder: `${state.valor!==null&&state.valor!==''?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" name="currency-brl" />}
                value={state.valor}
                onChangeText={(valor) => setValueState('valor', valor)}
                />
                <HelperText type="error" visible={errors.valor !== null ? true : false}>
                    {errors.valor}
                </HelperText>
                <View style={{flexDirection: "row", width: "70%", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row"}} >
                        <TextInput
                        style={[style.input, { width: "80%" }]}
                        mode='flat'
                        activeOutlineColor='#fff'
                        label="Duração"
                        editable={false}
                        keyboardType="decimal-pad"
                        error={errors.duracao !== null ? true : false}
                        onFocus={() => handleError(null, 'duracao')}
                        theme={{ colors: { placeholder: `${state.duracao!==null&&state.duracao!==''?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
                        left={<TextInput.Icon color="white" name="clock-outline" />}
                        value={state.duracao}
                        onChangeText={(duracao) => setValueState('duracao', duracao)}
                        />
                    </View>
                    <View style={{justifyContent: "center"}}>
                        <Text style={style.text}>Minutos</Text>
                    </View>
                </View>
                <HelperText type="error" visible={errors.duracao !== null ? true : false}>
                    {errors.duracao}
                </HelperText>
            </View>
        </KeyboardAvoidingWrapper>
    )
}

export default DadosServico;