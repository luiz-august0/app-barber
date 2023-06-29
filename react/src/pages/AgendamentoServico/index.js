import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import style from "./style";
import { useIsFocused } from "@react-navigation/native";
import AbsoluteModal from "../../components/AbsoluteModal";
import { TextInput } from "react-native-paper";
import { getBarbeariaCategoriaServicos, getBarbeariaCategorias } from "../../services/api";
import ServicoComponent from "../../components/ServicoComponent";

const AgendamentoServico = (props) => {
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loadingServicos, setLoadingServicos] = useState(false);
    const [initialCategorias, setInitialCategorias] = useState([]);
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [initialCategoriaServicos, setInitialCategoriaServicos] = useState([]);
    const [filteredCategoriaServicos, setFilteredCategoriaServicos] = useState([]);

    const getCategorias = async() => {
        setRefresh(true);
        try {
            const res = await getBarbeariaCategorias(props.route.params?.barbeariaID);
            setInitialCategorias(res.data);
            setFilteredCategorias(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar as categorias de serviço, contate o suporte");
        }
        setRefresh(false);
    }

    const getCategoriaServicos = async(id) => {
        setLoadingServicos(true);
        try {
            const res = await getBarbeariaCategoriaServicos(id);
            setInitialCategoriaServicos(res.data);
            setFilteredCategoriaServicos(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os serviços da categoria selecionada, contate o suporte");
        }
        setLoadingServicos(false);
    }

    const onRefresh = () => {
        getCategorias();
    }

    useEffect(() => {
        if(isFocused) { 
            getCategorias();
        }
    }, [props, isFocused]);

	const handleSelect = (cod) => {
		getCategoriaServicos(cod);
		setModalVisible(true);
	}

    const handlePressOut = () => {
        setInitialCategoriaServicos([]);
        setFilteredCategoriaServicos([]);
        setModalVisible(false);
    }

	const filterCategoriaByNome = (search) => {
		let oldArray = initialCategorias;
		let newArray = oldArray.filter(e => (new RegExp(search)).test(e.ServCat_Nome));

		if (search !== '') {
			setFilteredCategorias(newArray);
		} else {
			setFilteredCategorias(oldArray);
		}
	}

	const filterServicosByNome = (search) => {
		let oldArray = initialCategoriaServicos;
		let newArray = oldArray.filter(e => (new RegExp(search)).test(e.Serv_Nome));

		if (search !== '') {
			setFilteredCategoriaServicos(newArray);
		} else {
			setFilteredCategoriaServicos(oldArray);
		}
	}

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => onRefresh()}/> }
            >
                <Text style={style.textTitle}>ESCOLHA UM SERVIÇO</Text>
                <View style={style.headerView}>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#FFCA9F'
                    label="Pesquisar"
                    theme={{ colors: { placeholder: "#BA6213", text: '#BA6213', primary: '#BA6213' } }}
                    left={<TextInput.Icon color="#BA6213" name="magnify"/>}
                    onChangeText={(search) => filterCategoriaByNome(search)}
                    />
                </View>
                <View style={{padding: 10}}>
                    {JSON.stringify(filteredCategorias) !== "[]"?
                    <>   
                        <Text style={style.textSubTitle}>
                            CATEGORIAS DE SERVIÇO
                        </Text>
                        <View style={{height: 2, backgroundColor: '#2B513B'}}></View>
                        {filteredCategorias.map((e) => {
                            return (
                                <View key={e.ServCat_Codigo} style={style.categoriaComponent}>
                                    <View style={style.categoriaView}>
                                        <View style={{width: '60%'}}>
                                            <Text style={style.textCategoria} >{e.ServCat_Nome}</Text>
                                        </View>
                                        <View style={style.categoriaViewButtons}>
                                            <TouchableOpacity style={style.buttonCategoriaComponent} onPress={() => handleSelect(e.ServCat_Codigo)}>
                                                <Text style={style.textCategoriaButton}>Ver serviços</Text>
                                                <MIcon name="arrow-forward" size={25} color={'#2B513B'}></MIcon>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </>
                    :<Text style={[style.textSubTitle, { textAlign: 'center' }]}>Não há categorias de serviço cadastradas</Text>}
                </View>
                <AbsoluteModal handlePressOut={handlePressOut} modalVisible={modalVisible} width={'100%'}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {loadingServicos?<ActivityIndicator size={"large"}/>:
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <TextInput
                            style={[style.input, { backgroundColor: '#fff' }]}
                            mode='flat'
                            activeOutlineColor='#FFCA9F'
                            label="Pesquisar"
                            theme={{ colors: { placeholder: "#BA6213", text: '#BA6213', primary: '#BA6213' } }}
                            left={<TextInput.Icon color="#BA6213" name="magnify"/>}
                            onChangeText={(search) => filterServicosByNome(search)}
                            />
                            {JSON.stringify(filteredCategoriaServicos) !== "[]"?
                            <View style={{marginTop: 20}}>                            
                                {filteredCategoriaServicos.map((e) => {
                                    return (
                                        <View key={e.Serv_Codigo}>
                                            <ServicoComponent 
                                            props={props}
                                            nome={e.Serv_Nome} 
                                            valor={e.Serv_Valor} 
                                            tempo={e.Minutos} 
                                            id={e.Serv_Codigo} 
                                            idCategoria={e.ServCat_Codigo}
                                            screenNavigation={'DadosServico'}
                                            barbeariaID={props.route.params?.barbeariaID}
                                            />
                                        </View>
                                    )
                                })}
                            </View>:<Text style={[style.textSubTitle, { textAlign: 'center' }]}>Não há serviços cadastrados</Text>}
                        </View>}
                    </ScrollView>
                </AbsoluteModal>
            </ScrollView>
        </SafeAreaView>
    )
}
    
export default AgendamentoServico;