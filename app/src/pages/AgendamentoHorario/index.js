import React, { useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, Alert, Platform, TouchableOpacity, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import style from "./style";
import globalFunction from "../../globalFunction";

const AgendamentoHorario = (props) => {
    const [refresh, setRefresh] = useState(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
  
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        if (Platform.OS !== 'ios') {
            setShow(false);
        }
        setDate(currentDate);
    };

    const getHorariosDisponiveis = async() => {
        setRefresh(true);
        try {

        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os horários disponíveis do barbeiro, contate o suporte");
        }
        setRefresh(false);
    }

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl onRefresh={() => getHorariosDisponiveis()}/> }
            >
                <Text style={style.textTitle}>ESCOLHA UMA DATA E HORÁRIO</Text>
                <View style={style.headerView}>
                    <TouchableOpacity style={style.buttonDate} onPress={() => setShow(true)}>
                        <Text style={style.text}>{globalFunction.formatStringDate(date)}</Text>
                        <Fontisto name="date" size={30} color={'#BA6213'}></Fontisto>
                    </TouchableOpacity>
                </View>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    is24Hour={true}
                    display={Platform.OS=="ios"?"spinner":"default"}
                    onChange={onChange}
                    />
                )}
                {Platform.OS=="ios"&&show?
                <View style={{alignItems: "center"}}>
                    <TouchableOpacity style={style.buttonConfirm} onPress={() => setShow(false)}>
                        <Text style={[style.text, { color: '#FFCA9F' }]}>CONFIRMAR</Text>
                    </TouchableOpacity>
                </View>:null}
            </ScrollView>
        </SafeAreaView>
    )
}
    
export default AgendamentoHorario;