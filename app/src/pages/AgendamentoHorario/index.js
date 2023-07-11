import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, Alert, Platform, TouchableOpacity, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import style from "./style";
import globalFunction from "../../globalFunction";
import { getHorariosDisponiveisBarbeiro, showBarbeariaServico } from "../../services/api";
import { useIsFocused } from "@react-navigation/native";

const AgendamentoHorario = (props) => {
    const isFocused = useIsFocused();
    const [refresh, setRefresh] = useState(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [horariosDisp, serHorariosDisp] = useState([]);
  
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        if (Platform.OS !== 'ios') {
            onConfirmDate(currentDate);
        }
    };

    const getHorariosDisponiveis = async(dateParameter) => {
        setRefresh(true);
        try {
            const resServico = await showBarbeariaServico(props.route.params?.servicoID);
            const res = await getHorariosDisponiveisBarbeiro(props.route.params?.barbeariaID, props.route.params?.barbeiroID, globalFunction.formatDateToSql(dateParameter), resServico.data[0].Minutos);
            serHorariosDisp(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os horários disponíveis do barbeiro, contate o suporte");
        }
        setRefresh(false);
    }

    const onConfirmDate = (date) => {
        setShow(false);
        getHorariosDisponiveis(date);
    }

    useEffect(() => {
        if(isFocused) { 
            getHorariosDisponiveis(new Date());
        }
    }, [props, isFocused]);

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getHorariosDisponiveis(date)}/> }
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
                    <TouchableOpacity style={style.buttonConfirm} onPress={() => onConfirmDate(date)}>
                        <Text style={[style.text, { color: '#FFCA9F' }]}>CONFIRMAR</Text>
                    </TouchableOpacity>
                </View>:null}
                {JSON.stringify(horariosDisp)!=="[]"?
                <View style={{padding: 10, marginTop: 10}}>
                    <Text style={style.textSubTitle}>
                        SELECIONE UM HORÁRIO
                    </Text>
                    <View style={{height: 2, backgroundColor: '#2B513B'}}></View>
                    <View style={style.viewHorarios}>
                        {horariosDisp.map((e) => (
                            <TouchableOpacity key={e.Horario} style={style.buttonHorario}>
                                <Text style={[style.text, { fontFamily: 'Manrope-Bold' }]}>{e.Horario}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>:<Text style={[style.textSubTitle, { textAlign: 'center', marginTop: 50 }]}>Não há horários disponíveis para a data selecionada</Text>}
            </ScrollView>
        </SafeAreaView>
    )
}
    
export default AgendamentoHorario;