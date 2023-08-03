import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, View, TouchableOpacity, Dimensions, Alert, Image, Platform } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DateTimePicker from '@react-native-community/datetimepicker';
import style from "./style";
import Dropdown from "../../components/DropDown";
import { useIsFocused } from "@react-navigation/native";
import { getAgendamentos, getUsuario } from "../../services/api";
import AbsoluteModal from "../../components/AbsoluteModal";
import { connect } from "react-redux";
import perfil from "../../img/perfil.png";
import globalFunction from "../../globalFunction";

const statusList = [
    {
        label: "Pendente",
        text: "Pendente"
    },
    {
        label: "Realizado",
        text: "Realizado"
    },
    {
        label: "Cancelado",
        text: "Cancelado"
    },
    {
        label: "Recusado",
        text: "Recusado"
    },
    {
        label: "Todos",
        text: "Todos"
    }
]

const initialStatusState = {label: 'Todos', text: 'Todos'};
let initialDate = new Date();
let initialFinalDate = new Date();
initialDate.setDate(initialDate.getDate() - 30);
initialFinalDate.setDate(initialFinalDate.getDate() + 30);

const Agendamentos = (props) => {
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [status, setStatus] = useState(initialStatusState);
    const [dataInicio, setDataInicio] = useState(initialDate);
    const [dataFim, setDataFim] = useState(initialFinalDate);
    const [showDataInicial, setShowDataInicial] = useState(false);
    const [showDataFinal, setShowDataFinal] = useState(false);
    const [agendamentos, setAgendamentos] = useState([]);

    const getMeusAgendamentos = async(dataInicio, dataFim, status) => {
        setRefresh(true);
        try {   
            let reqStatus = '';  
            let barbeariaID = ''
            let barbeiroID = '';
            let usuarioID = '';

            switch (status) {
                case "Pendente":
                    reqStatus = "P"
                    break;
                case "Realizado":
                    reqStatus = "P"
                    break;
                case "Cancelado":
                    reqStatus = "C"
                    break;
                case "Recusado":
                    reqStatus = "R"
                    break;
                default:
                    break;
            }

            if (props.usuario.state.tipo === "B" || props.usuario.state.tipo === "F") {
                const resUsuario = await getUsuario(props.usuario.state.id);
                barbeariaID = resUsuario.data[0].Barb_Codigo;

                if (props.usuario.state.tipo === "F") {
                    barbeiroID = props.usuario.state.id;
                }
            } else {
                usuarioID = props.usuario.state.id; 
            }

            const res = await getAgendamentos(barbeariaID, barbeiroID, usuarioID, null, globalFunction.formatDateToSql(dataInicio), globalFunction.formatDateToSql(dataFim), reqStatus);
            
            if (status == "Realizado" || status == "Pendente") {
                let arrayAgdm = [];

                res.data.map((item) => {
                    if (status == "Realizado") {
                        if (new Date(`${globalFunction.formatDateToSql(new Date(item.Agdm_Data))}T${item.Agdm_HoraInicio}`) <= new Date()) {
                            arrayAgdm.push(item);
                        }
                    } else {
                        if (new Date(`${globalFunction.formatDateToSql(new Date(item.Agdm_Data))}T${item.Agdm_HoraInicio}`) > new Date()) {
                            arrayAgdm.push(item);
                        }
                    }
                })
                
                setAgendamentos(arrayAgdm);
            } else {
                setAgendamentos(res.data);
            }

        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os agendamentos, contate o suporte");
        }
        setRefresh(false);
    }

    useEffect(() => {
        if(isFocused) { 
            setStatus(initialStatusState);
            getMeusAgendamentos(initialDate, initialFinalDate, null);
        }
    }, [props, isFocused]);

    const cleanFilters = () => {
        setDataInicio(initialDate);
        setDataFim(initialFinalDate);
        setStatus(initialStatusState);
        setModalVisible(false);
        getMeusAgendamentos(initialDate, initialFinalDate, null);
    }

    const handlePressFilter = () => {
        getMeusAgendamentos(dataInicio, dataFim, status.text);    
        setModalVisible(false);
    }

    const handlePressOut = () => {
        setModalVisible(false);
    }

    const onChangeDataInicial = (event, selectedDate) => {
        setDataInicio(selectedDate);
        if (Platform.OS !== 'ios') {
            setShowDataInicial(false);
        }
    };

    const onChangeDataFinal = (event, selectedDate) => {
        setDataFim(selectedDate);
        if (Platform.OS !== 'ios') {
            setShowDataFinal(false);
        }
    };

    const renderItem = (item) => {
        let status = "";
        let renderStatus = "";
        let renderColor = "";

        if (item.Agdm_Status == "P") {
            let agdmDate = globalFunction.formatDateToSql(new Date(item.Agdm_Data));

            if (new Date(`${agdmDate}T${item.Agdm_HoraInicio}`) <= new Date()) {
                status = "RE";
            } else {
                status = "P";
            }
        } else {
            status = item.Agdm_Status;
        }

        switch (status) {
            case "P":
                renderStatus = "Pendente";
                renderColor = "#F6C602";
                break;
            case "RE":
                renderStatus = "Realizado";
                renderColor = "#10E805";
                break;
            case "R":
                renderStatus = "Recusado";
                renderColor = "#EA0800";
                break;
            case "C":
                renderStatus = "Cancelado";
                renderColor = "#EA0800";
                break;
            default:
                break;
        }

        return (
            <TouchableOpacity 
            key={item.Agdm_Codigo} 
            style={style.item}
            onPress={() => props.navigation.navigate('AgendamentoDetalhes', { 
                agdmID: item.Agdm_Codigo,
                barbeariaID: item.Barb_Codigo,
                barbeiroID: item.Agdm_Barbeiro,
                servicoID: item.Serv_Codigo,
                tempServ: item.Minutos,
                horaInicio: item.Agdm_HoraInicio,
                data: new Date(item.Agdm_Data),
                status: status
            })}>
                {item.Barb_LogoUrl!==null&&item.Barb_LogoUrl!==""?
                <Image style={style.image} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${item.Barb_LogoUrl}`}}/>
                :<Image style={style.image} source={perfil}/>}
                <View style={style.contentItem}>
                    <Text style={[style.standardText, { fontFamily: 'Manrope-Bold' }]}>{`${globalFunction.formatStringDate(new Date(item.Agdm_Data))} - ${item.Agdm_HoraInicio}`}</Text>
                    <View style={style.contentItemStatus}>
                        <View style={[style.statusComponent, { backgroundColor: renderColor }]}/>
                        <Text style={style.standardText}>{`Status: ${renderStatus}`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getMeusAgendamentos(dataInicio, dataFim, status.text)}/> }
            >
                <Text style={style.textTitle}>SEUS AGENDAMENTOS</Text>
                <View style={style.headerView}>
                    {props.usuario.state.tipo==="C"?
                    <TouchableOpacity style={style.button} onPress={() => props.navigation.navigate('AgendamentoBarbearia')}>
                        <Text style={style.text}>REALIZAR NOVO AGENDAMENTO</Text>
                    </TouchableOpacity>:null}
                    <TouchableOpacity style={style.buttonFilter} onPress={() => setModalVisible(true)}>
                        <Text style={[style.text, { color: '#BA6213' }]}>FILTRAR</Text>
                        <MIcon name="filter" size={30} color={'#BA6213'}></MIcon>
                    </TouchableOpacity>
                </View>
                <View style={{padding: 10}}>
                    {JSON.stringify(agendamentos)=="[]"?
                    <Text style={[style.textSubTitle, { textAlign: 'center' }]}>Não há agendamentos para visualizar</Text>:
                    <View style={style.itemsView}>                    
                        {agendamentos.map((item) => renderItem(item))}
                    </View>
                    }
                </View>
                <AbsoluteModal handlePressOut={handlePressOut} modalVisible={modalVisible} width={'100%'}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={style.modalFiltersView}>
                            <View style={{alignItems: "center"}}>
                                <Text style={[style.text, { color: '#000' }]}>Status do agendamento</Text>
                                <Dropdown label="Status" data={statusList} onSelect={setStatus} initialValue={status} dropdownWidth={Dimensions.get('window').width / 2.5}/>
                            </View>
                            <View style={{marginTop: 20}}>
                                <Text style={[style.text, { color: '#000' }]}>Data inicial</Text>
                                <TouchableOpacity style={style.buttonDate} onPress={() => setShowDataInicial(true)}>
                                    <Text style={[style.text, { color: '#BA6213' }]}>{globalFunction.formatStringDate(dataInicio)}</Text>
                                    <Fontisto name="date" size={30} color={'#BA6213'}></Fontisto>
                                </TouchableOpacity>
                                {showDataInicial && (
                                    <DateTimePicker
                                    testID="dateTimePicker"
                                    value={dataInicio}
                                    mode={'date'}
                                    is24Hour={true}
                                    display={Platform.OS=="ios"?"spinner":"default"}
                                    onChange={onChangeDataInicial}
                                    />
                                )}
                                {Platform.OS=="ios"&&showDataInicial?
                                <View style={{alignItems: "center"}}>
                                    <TouchableOpacity style={style.buttonConfirmDate} onPress={() => setShowDataInicial(false)}>
                                        <Text style={[style.text, { color: '#FFCA9F' }]}>CONFIRMAR</Text>
                                    </TouchableOpacity>
                                </View>:null}
                            </View>
                            <View style={{marginTop: 20}}>
                                <Text style={[style.text, { color: '#000' }]}>Data final</Text>
                                <TouchableOpacity style={style.buttonDate} onPress={() => setShowDataFinal(true)}>
                                    <Text style={[style.text, { color: '#BA6213' }]}>{globalFunction.formatStringDate(dataFim)}</Text>
                                    <Fontisto name="date" size={30} color={'#BA6213'}></Fontisto>
                                </TouchableOpacity>
                                {showDataFinal && (
                                    <DateTimePicker
                                    testID="dateTimePicker"
                                    value={dataFim}
                                    mode={'date'}
                                    is24Hour={true}
                                    display={Platform.OS=="ios"?"spinner":"default"}
                                    onChange={onChangeDataFinal}
                                    />
                                )}
                                {Platform.OS=="ios"&&showDataFinal?
                                <View style={{alignItems: "center"}}>
                                    <TouchableOpacity style={style.buttonConfirmDate} onPress={() => setShowDataFinal(false)}>
                                        <Text style={[style.text, { color: '#FFCA9F' }]}>CONFIRMAR</Text>
                                    </TouchableOpacity>
                                </View>:null}
                            </View>
                            <TouchableOpacity style={style.buttonConfirmFilter} onPress={() => handlePressFilter()}>
                                <Text style={style.standardText}>FILTRAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.buttonConfirmFilter, { marginTop: 0, backgroundColor: '#BA6213' }]} onPress={() => cleanFilters()}>
                                <Text style={style.standardText}>LIMPAR FILTROS</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </AbsoluteModal>
            </ScrollView>
        </SafeAreaView>
    )
}

const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}
    
export default connect(mapStateToProps, null)(Agendamentos);