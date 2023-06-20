import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, View, TouchableOpacity, Dimensions, Alert, Image, Platform, PermissionsAndroid } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import style from "./style";
import Dropdown from "../../components/DropDown";
import { useIsFocused } from "@react-navigation/native";
import { getBarbeariasPesquisa, getBarbeariasVisitadas } from "../../services/api";
import AbsoluteModal from "../../components/AbsoluteModal";
import { connect } from "react-redux";
import { HelperText, TextInput } from "react-native-paper";
import perfil from "../../img/perfil.png";
import StarRate from "../../components/StarRate";
import * as Location from 'expo-location';
import globalFunction from "../../globalFunction";

const ordens = [
    {
        label: "Nome",
        text: "Nome"
    },
    {
        label: "Distância",
        text: "Distância"
    }
]

const initialOrdemState = {label: 'Distância', text: 'Distância'};

const AgendamentoBarbearia = (props) => {
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [ordem, setOrdem] = useState(initialOrdemState);
    const [barbeariasPesq, setBarbeariasPesq] = useState([]);
    const [barbeariasVisitadas, setBarbeariasVisitadas] = useState([]);
    const [state, setState] = useState({'nome': null, 'cidade': null, 'endRua': null, 'endNumero': null, 'endBairro': null});
    const [errors, setErrors] = useState({'nome': null, 'cidade': null, 'endRua': null, 'endNumero': null, 'endBairro': null});

    const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const getBarbearias = async(nome, cidade, endRua, endNumero, endBairro) => {
        setRefresh(true);
        try {        
            let location = [];

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Atenção", "Você recusou este app para acessar sua localização!");
            } else {
                location = await Location.getCurrentPositionAsync({});
            }

            let res = [];
            let arrayPesq = [];
            let arrayVisit = [];
            if (nome !== undefined) {
                res = await getBarbeariasPesquisa(nome, cidade, endRua, endNumero, endBairro);
            } else {
                res = await getBarbeariasPesquisa(null, null, null, null, null);
            }

            res.data.map((e) => {
                const distance = status=='granted'?globalFunction.getDistanceFromLatLonInKm(
                    {lat: e.Barb_GeoLatitude, lng: e.Barb_GeoLongitude},
                    {lat: location.coords.latitude, lng: location.coords.longitude}
                ):0;

                arrayPesq.push({Barb_Codigo: e.Barb_Codigo, Barb_Nome: e.Barb_Nome, Barb_Rua: e.Barb_Rua, Barb_Numero: e.Barb_Numero,
                    Barb_Bairro: e.Barb_Bairro, Barb_Cidade: e.Barb_Cidade, Barb_UF: e.Barb_UF, Aval_Rate: e.Aval_Rate, Barb_LogoUrl: e.Barb_LogoUrl,
                    Distance: status=='granted'?distance:0, DistanceCalculated: status=='granted'?distance/1000:0});
            });

            const resVisitadas = await getBarbeariasVisitadas(props.usuario.state.id);
            resVisitadas.data.map((e) => {
                const distance = status=='granted'?globalFunction.getDistanceFromLatLonInKm(
                    {lat: e.Barb_GeoLatitude, lng: e.Barb_GeoLongitude},
                    {lat: location.coords.latitude, lng: location.coords.longitude}
                ):0;

                arrayVisit.push({Barb_Codigo: e.Barb_Codigo, Barb_Nome: e.Barb_Nome, Barb_Rua: e.Barb_Rua, Barb_Numero: e.Barb_Numero,
                    Barb_Bairro: e.Barb_Bairro, Barb_Cidade: e.Barb_Cidade, Barb_UF: e.Barb_UF, Aval_Rate: e.Aval_Rate, Barb_LogoUrl: e.Barb_LogoUrl,
                    Distance: status=='granted'?distance:0, DistanceCalculated: status=='granted'?distance/1000:0});
            });

            setBarbeariasPesq(arrayPesq);
            setBarbeariasVisitadas(arrayVisit);
        } catch (error) {
            console.log(error)
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar as barbearias, contate o suporte");
        }
        setRefresh(false);
    }

    useEffect(() => {
        if(isFocused) { 
            getBarbearias();
        }
    }, [props, isFocused]);

    const cleanFilters = () => {
        setValueState('nome', null);
        setValueState('cidade', null);
        setValueState('endRua', null);
        setValueState('endNumero', null);
        setValueState('endBairro', null);
        setModalVisible(false);
        getBarbearias();
    }

    const handlePressFilter = () => {
        getBarbearias(state.nome, state.cidade, state.endRua, state.endNumero, state.endBairro); 
        setModalVisible(false);
    }

    const handlePressOut = () => {
        setModalVisible(false);
    }

    const renderItem = (item) => {
        let distance = '';
        if (item.Distance < 1000) {
            distance = `${item.Distance.toString()}m`;
        } else {
            distance = `${(item.Distance / 1000).toString().replace('.', ',')}km`
        }

        return (
            <TouchableOpacity key={item.Barb_Codigo} style={style.renderItemBarbearia}>
                {item.Barb_LogoUrl!==null&&item.Barb_LogoUrl!==""?
                <Image style={style.image} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${item.Barb_LogoUrl}`}}/>
                :<Image style={style.image} source={perfil}/>}
                <View style={{flex:1, padding: 10}}>
                    <Text style={style.textTitleBarb}>{item.Barb_Nome}</Text>
                    <Text style={style.textSubtitleBarb}>{`${item.Barb_Rua}, ${item.Barb_Numero} - ${item.Barb_Bairro}, ${item.Barb_Cidade} - ${item.Barb_UF}`}</Text>
                    {item.Distance!==0?<Text style={[style.textSubtitleBarb, {fontFamily: 'Montserrat-Bold'}]}>{`Distância: ${distance}`}</Text>:null}
                    <StarRate starRating={item.Aval_Rate}/>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getBarbearias(state.nome, state.cidade, state.endRua, state.endNumero, state.endBairro)}/> }
            >
                <Text style={style.textTitle}>Escolha uma barbearia</Text>
                <View style={style.headerView}>
                    <TouchableOpacity style={style.button}>
                        <Text style={style.text}>Ver no mapa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.buttonFilter} onPress={() => setModalVisible(true)}>
                        <Text style={[style.text, { color: '#000', fontSize: 18 }]}>Filtros</Text>
                        <MIcon name="filter" size={30} color={'#000'}></MIcon>
                    </TouchableOpacity>
                </View>
                <View style={{padding: 10}}>
                    <View style={{marginTop: 10, alignItems: "flex-end"}}>
                        <View style={{alignItems: "center"}}>
                            <Text style={[style.text, { color: '#000', fontSize: 14 }]}>Ordenar por</Text>
                            <Dropdown label="Ordenação" data={ordens} onSelect={setOrdem} initialValue={initialOrdemState} dropdownWidth={Dimensions.get('window').width / 2.5}/>
                        </View>
                    </View>
                    {JSON.stringify(barbeariasVisitadas)!=="[]"?
                    <>
                        <Text style={style.textSubTitle}>
                            Barbearias já visitadas
                        </Text>
                        <View style={{height: 2, backgroundColor: '#000'}}></View>
                        {barbeariasVisitadas
                            .sort((a, b) => ordem.label=="Nome"?a.Barb_Nome < b.Barb_Nome ? -1 : true:a.DistanceCalculated > b.DistanceCalculated)
                            .map((e) => { return renderItem(e)})}
                        <View style={{height: 2, backgroundColor: '#000', marginTop: 20}}></View>
                    </>
                    :null}
                    <Text style={[style.textSubTitle, {marginTop: JSON.stringify(barbeariasVisitadas)!=="[]"?50:20}]}>
                        Conheça novas barbearias
                    </Text>
                    <View style={{height: 2, backgroundColor: '#000'}}></View>
                    {barbeariasPesq
                        .sort((a, b) => ordem.label=="Nome"?a.Barb_Nome < b.Barb_Nome ? -1 : true:a.DistanceCalculated > b.DistanceCalculated)
                        .map((e) => { return renderItem(e)})}
                </View>
                <AbsoluteModal handlePressOut={handlePressOut} modalVisible={modalVisible} width={'100%'}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#fff'
                            label="Nome"
                            error={errors.nome !== null ? true : false}
                            onFocus={() => handleError(null, 'nome')}
                            theme={{ colors: { placeholder: `${state.nome!==null&&state.nome!==''?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
                            left={<TextInput.Icon color="white" name="account" />}
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
                            label="Cidade"
                            error={errors.cidade !== null ? true : false}
                            onFocus={() => handleError(null, 'cidade')}
                            theme={{ colors: { placeholder: `${state.cidade!==null&&state.cidade!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                            left={<TextInput.Icon color="white" name="home-city" />}
                            value={state.cidade}
                            onChangeText={(cidade) => setValueState('cidade', cidade)}
                            />
                            <HelperText type="error" visible={errors.cidade !== null ? true : false}>
                                {errors.cidade}
                            </HelperText>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#fff'
                            label="Rua"
                            error={errors.endRua !== null ? true : false}
                            onFocus={() => handleError(null, 'endRua')}
                            theme={{ colors: { placeholder: `${state.endRua!==null&&state.endRua!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                            left={<TextInput.Icon color="white" name="home-city" />}
                            value={state.endRua}
                            onChangeText={(endRua) => setValueState('endRua', endRua)}
                            />
                            <HelperText type="error" visible={errors.endRua !== null ? true : false}>
                                {errors.endRua}
                            </HelperText>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#fff'
                            label="Número"
                            keyboardType="number-pad"
                            error={errors.endNumero !== null ? true : false}
                            onFocus={() => handleError(null, 'endNumero')}
                            theme={{ colors: { placeholder: `${state.endNumero!==null&&state.endNumero!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                            left={<TextInput.Icon color="white" name="home-city" />}
                            value={state.endNumero}
                            onChangeText={(endNumero) => setValueState('endNumero', endNumero)}
                            />
                            <HelperText type="error" visible={errors.endNumero !== null ? true : false}>
                                {errors.endNumero}
                            </HelperText>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#fff'
                            label="Bairro"
                            error={errors.endBairro !== null ? true : false}
                            onFocus={() => handleError(null, 'endBairro')}
                            theme={{ colors: { placeholder: `${state.endBairro!==null&&state.endBairro!==''?"white":"gray"}`, text: 'white', primary: 'white' } }}
                            left={<TextInput.Icon color="white" name="home-city" />}
                            value={state.endBairro}
                            onChangeText={(endBairro) => setValueState('endBairro', endBairro)}
                            />
                            <HelperText type="error" visible={errors.endBairro !== null ? true : false}>
                                {errors.endBairro}
                            </HelperText>
                            <TouchableOpacity style={style.buttonConfirmFilter} onPress={() => handlePressFilter()}>
                                <Text style={[ style.text, { color: "#fff", fontSize: 14 }]}>Filtrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.buttonConfirmFilter, { marginTop: 0, backgroundColor: '#404040' }]} onPress={() => cleanFilters()}>
                                <Text style={[ style.text, { color: "#fff", fontSize: 14 }]}>Limpar filtros</Text>
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
    
export default connect(mapStateToProps, null)(AgendamentoBarbearia);