import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, View, TouchableOpacity, Dimensions, Alert, Image, Platform, PermissionsAndroid } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MAIcon from 'react-native-vector-icons/MaterialIcons';
import style from "./style";
import Dropdown from "../../components/DropDown";
import { useIsFocused } from "@react-navigation/native";
import { getAddress, getBarbeariasPesquisa, getBarbeariasVisitadas } from "../../services/api";
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
    },
    {
        label: "Melhor Avaliação",
        text: "Melhor Avaliação"
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
    const [state, setState] = useState({'nome': null, 'cidade': null, 'cidadeLocal': null, 'endRua': null, 'endNumero': null, 'endBairro': null});
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
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Atenção", "Você recusou este app para acessar sua localização. Para visualizar as barbearias disponíveis é necessário ativar a localização para este aplicativo");
                setRefresh(false);
                return;
            } 
            
            let location = await Location.getLastKnownPositionAsync({});
            if (JSON.stringify(location) == "[]") {
                location = await Location.getCurrentPositionAsync({});
            }

            let res = [];
            let arrayPesq = [];
            let arrayVisit = [];
            if (nome !== undefined) {
                res = await getBarbeariasPesquisa(nome, cidade, endRua, endNumero, endBairro, props.usuario.state.id);
            } else {
                res = await getBarbeariasPesquisa(null, null, null, null, null, props.usuario.state.id);
            }

            res.data.map((e) => {
                const distance = status=='granted'?globalFunction.getDistanceFromLatLonInKm(
                    {lat: e.Barb_GeoLatitude, lng: e.Barb_GeoLongitude},
                    {lat: location.coords.latitude, lng: location.coords.longitude}
                ):0;

                arrayPesq.push({Barb_Codigo: e.Barb_Codigo, Barb_Nome: e.Barb_Nome, Barb_Rua: e.Barb_Rua, Barb_Numero: e.Barb_Numero,
                    Barb_Bairro: e.Barb_Bairro, Barb_Cidade: e.Barb_Cidade, Barb_UF: e.Barb_UF, Aval_Rate: e.Aval_Rate==null?0:e.Aval_Rate, Barb_LogoUrl: e.Barb_LogoUrl,
                    Distance: status=='granted'?distance:0, DistanceCalculated: status=='granted'?distance/1000:0});
            });

            const resVisitadas = await getBarbeariasVisitadas(props.usuario.state.id);
            resVisitadas.data.map((e) => {
                const distance = status=='granted'?globalFunction.getDistanceFromLatLonInKm(
                    {lat: e.Barb_GeoLatitude, lng: e.Barb_GeoLongitude},
                    {lat: location.coords.latitude, lng: location.coords.longitude}
                ):0;

                arrayVisit.push({Barb_Codigo: e.Barb_Codigo, Barb_Nome: e.Barb_Nome, Barb_Rua: e.Barb_Rua, Barb_Numero: e.Barb_Numero,
                    Barb_Bairro: e.Barb_Bairro, Barb_Cidade: e.Barb_Cidade, Barb_UF: e.Barb_UF, Aval_Rate: e.Aval_Rate==null?0:e.Aval_Rate, Barb_LogoUrl: e.Barb_LogoUrl,
                    Distance: status=='granted'?distance:0, DistanceCalculated: status=='granted'?distance/1000:0});
            });

            setBarbeariasPesq(arrayPesq);
            setBarbeariasVisitadas(arrayVisit);
        } catch (error) {
            console.log(error)
            Alert.alert("Atenção", "Ops, ocorreu um erro ao carregar as barbearias, contate o suporte");
        }
        setRefresh(false);
    }

    const getAddressLocation = async() => {
        try {  
            let location = await Location.getLastKnownPositionAsync({});
            if (JSON.stringify(location) == "[]") {
                location = await Location.getCurrentPositionAsync({});
            }
            let address = (await getAddress(location.coords.latitude, location.coords.longitude)).data.results[6].address_components[0].long_name;
            setValueState('cidade', address);
            setValueState('cidadeLocal', address);
            setRefresh(true);
            return address;
        } catch (error) {
            return "";
        }
    }

    useEffect(() => {
        if(isFocused) { 
            getAddressLocation().then(res => {
                getBarbearias(state.nome, res, state.endRua, state.endNumero, state.endBairro);
            })
        }
    }, [props, isFocused]);

    const cleanFilters = () => {
        setValueState('nome', null);
        setValueState('endRua', null);
        setValueState('cidade', state.cidadeLocal);
        setValueState('endNumero', null);
        setValueState('endBairro', null);
        handleError(null, 'cidade')
        setModalVisible(false);
        getBarbearias(state.nome, state.cidadeLocal, state.endRua, state.endNumero, state.endBairro);
    }

    const handlePressFilter = () => {
        if (state.cidade!==""&&state.cidade!==null) {
            getBarbearias(state.nome, state.cidade, state.endRua, state.endNumero, state.endBairro); 
            setModalVisible(false);
        } else {
            handleError('Cidade deve ser informada', 'cidade')
        }
    }

    const handlePressOut = () => {
        setModalVisible(false);
    }

    const renderItem = (item) => {
        let distance = '';
        if (item.Distance < 1000) {
            distance = `${item.Distance.toFixed(0).toString()}m`;
        } else {
            distance = `${(item.Distance / 1000).toFixed(2).toString().replace('.', ',')}km`
        }

        return (
            <View key={item.Barb_Codigo} style={style.renderItemBarbearia}>
                {item.Barb_LogoUrl!==null&&item.Barb_LogoUrl!==""?
                <Image style={style.image} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${item.Barb_LogoUrl}`}}/>
                :<Image style={style.image} source={perfil}/>}
                <View style={{flex:1, padding: 10}}>
                    <Text style={style.textTitleBarb}>{item.Barb_Nome}</Text>
                    <Text style={style.textSubtitleBarb}>{`${item.Barb_Rua}, ${item.Barb_Numero} - ${item.Barb_Bairro}, ${item.Barb_Cidade} - ${item.Barb_UF}`}</Text>
                    {item.Distance!==0?<Text style={[style.textSubtitleBarb, {fontFamily: 'Manrope-Bold', color: '#2B513B'}]}>{`Distância: ${distance}`}</Text>:null}
                    <StarRate starRating={item.Aval_Rate}/>
                    <TouchableOpacity style={style.buttonRenderItem} onPress={() => props.navigation.navigate("PerfilBarbearia", { barbeariaID: item.Barb_Codigo})}>
                        <Text style={[style.textSubtitleBarb, {marginRight: 5}]}>Ver perfil da barbearia</Text>
                        <MIcon name="eye" size={30} color={'#000'}></MIcon>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.buttonRenderItem} onPress={() => props.navigation.navigate("AgendamentoServico", { barbeariaID: item.Barb_Codigo})}>
                        <Text style={[style.textSubtitleBarb, {marginRight: 5}]}>Selecionar barbearia</Text>
                        <MAIcon name="arrow-forward" size={30} color={'#2B513B'}></MAIcon>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const sortBarbearias = (a, b) => {
        switch (ordem.label) {
            case "Nome":
                return a.Barb_Nome < b.Barb_Nome ? -1 : true;
            case "Distância":  
                return a.DistanceCalculated < b.DistanceCalculated ? -1 : true;
            default:
                return a.Aval_Rate > b.Aval_Rate ? -1 : true;
        }
    }

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getBarbearias(state.nome, state.cidade, state.endRua, state.endNumero, state.endBairro)}/> }
            >
                <Text style={style.textTitle}>ESCOLHA UMA BARBEARIA</Text>
                <View style={style.headerView}>
                    <TouchableOpacity style={style.button}>
                        <Text style={style.text}>VER NO MAPA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.buttonFilter} onPress={() => setModalVisible(true)}>
                        <Text style={[style.text, { color: '#BA6213' }]}>FILTRAR</Text>
                        <MIcon name="filter" size={30} color={'#BA6213'}></MIcon>
                    </TouchableOpacity>
                </View>
                <View style={{padding: 10}}>
                    <View style={{marginTop: 10, alignItems: "flex-end"}}>
                        <View style={{alignItems: "center"}}>
                            <Text style={[style.text, { color: '#000' }]}>Ordenar por</Text>
                            <Dropdown label="Ordenação" data={ordens} onSelect={setOrdem} initialValue={initialOrdemState} dropdownWidth={Dimensions.get('window').width / 2.5}/>
                        </View>
                    </View>
                    {(refresh)&&(JSON.stringify(barbeariasVisitadas)=="[]"||JSON.stringify(barbeariasPesq)=="[]")?<Text style={[style.textSubTitle, { textAlign: 'center' }]}>Carregando barbearias...</Text>
                    :
                    <>
                        {JSON.stringify(barbeariasVisitadas)=="[]"&&JSON.stringify(barbeariasPesq)=="[]"?
                        <Text style={[style.textSubTitle, { textAlign: 'center' }]}>Não há barbearias para visualizar</Text>:
                        <>                    
                            {JSON.stringify(barbeariasVisitadas)!=="[]"?
                            <>
                                <Text style={style.textSubTitle}>
                                    BARBEARIAS JÁ VISITADAS
                                </Text>
                                <View style={{height: 2, backgroundColor: '#2B513B'}}></View>
                                {barbeariasVisitadas
                                    .sort((a, b) => sortBarbearias(a,b))
                                    .map((e) => { return renderItem(e)})}
                                {JSON.stringify(barbeariasPesq)!=="[]"?<View style={{height: 2, backgroundColor: '#2B513B', marginTop: 20}}></View>:null}
                            </>
                            :null}
                            {JSON.stringify(barbeariasPesq)!=="[]"?
                            <>                        
                                <Text style={[style.textSubTitle, {marginTop: JSON.stringify(barbeariasVisitadas)!=="[]"?50:20}]}>
                                    CONHEÇA NOVAS BARBEARIAS
                                </Text>
                                <View style={{height: 2, backgroundColor: '#2B513B'}}></View>
                                {barbeariasPesq
                                    .sort((a, b) => sortBarbearias(a,b))
                                    .map((e) => { return renderItem(e)})}
                            </>:null}
                        </>
                        }
                    </>}
                </View>
                <AbsoluteModal handlePressOut={handlePressOut} modalVisible={modalVisible} width={'100%'}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#FFCA9F'
                            label="Nome"
                            error={errors.nome !== null ? true : false}
                            onFocus={() => handleError(null, 'nome')}
                            theme={{ colors: { placeholder: `${state.nome!==null&&state.nome!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                            left={<TextInput.Icon color="#FFCA9F" name="account" />}
                            value={state.nome}
                            onChangeText={(nome) => setValueState('nome', nome)}
                            />
                            <HelperText type="error" visible={errors.nome !== null ? true : false}>
                                {errors.nome}
                            </HelperText>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#FFCA9F'
                            label="Cidade"
                            error={errors.cidade !== null ? true : false}
                            onFocus={() => handleError(null, 'cidade')}
                            theme={{ colors: { placeholder: `${state.cidade!==null&&state.cidade!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                            left={<TextInput.Icon color="#FFCA9F" name="home-city" />}
                            value={state.cidade}
                            onChangeText={(cidade) => setValueState('cidade', cidade)}
                            />
                            <HelperText type="error" visible={errors.cidade !== null ? true : false}>
                                {errors.cidade}
                            </HelperText>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#FFCA9F'
                            label="Rua"
                            error={errors.endRua !== null ? true : false}
                            onFocus={() => handleError(null, 'endRua')}
                            theme={{ colors: { placeholder: `${state.endRua!==null&&state.endRua!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                            left={<TextInput.Icon color="#FFCA9F" name="home-city" />}
                            value={state.endRua}
                            onChangeText={(endRua) => setValueState('endRua', endRua)}
                            />
                            <HelperText type="error" visible={errors.endRua !== null ? true : false}>
                                {errors.endRua}
                            </HelperText>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#FFCA9F'
                            label="Número"
                            keyboardType="number-pad"
                            error={errors.endNumero !== null ? true : false}
                            onFocus={() => handleError(null, 'endNumero')}
                            theme={{ colors: { placeholder: `${state.endNumero!==null&&state.endNumero!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                            left={<TextInput.Icon color="#FFCA9F" name="home-city" />}
                            value={state.endNumero}
                            onChangeText={(endNumero) => setValueState('endNumero', endNumero)}
                            />
                            <HelperText type="error" visible={errors.endNumero !== null ? true : false}>
                                {errors.endNumero}
                            </HelperText>
                            <TextInput
                            style={style.input}
                            mode='flat'
                            activeOutlineColor='#FFCA9F'
                            label="Bairro"
                            error={errors.endBairro !== null ? true : false}
                            onFocus={() => handleError(null, 'endBairro')}
                            theme={{ colors: { placeholder: `${state.endBairro!==null&&state.endBairro!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                            left={<TextInput.Icon color="#FFCA9F" name="home-city" />}
                            value={state.endBairro}
                            onChangeText={(endBairro) => setValueState('endBairro', endBairro)}
                            />
                            <HelperText type="error" visible={errors.endBairro !== null ? true : false}>
                                {errors.endBairro}
                            </HelperText>
                            <TouchableOpacity style={style.buttonConfirmFilter} onPress={() => handlePressFilter()}>
                                <Text style={{ color: '#FFCA9F', fontFamily: 'Manrope-Regular'}}>FILTRAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.buttonConfirmFilter, { marginTop: 0, backgroundColor: '#BA6213' }]} onPress={() => cleanFilters()}>
                                <Text style={{ color: '#FFCA9F', fontFamily: 'Manrope-Regular'}}>LIMPAR FILTROS</Text>
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