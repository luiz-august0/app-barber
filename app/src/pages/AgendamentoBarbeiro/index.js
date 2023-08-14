import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, View, Alert, Image, TouchableOpacity } from "react-native";
import style from "./style";
import perfil from "../../img/perfil.png";
import MAIcon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import { getBarbeirosByServico } from "../../services/api";
import StarRate from "../../components/StarRate";
import globalFunction from '../../globalFunction';

const AgendamentoBarbeiro = (props) => {
    const isFocused = useIsFocused();
    const [refresh, setRefresh] = useState(false);
    const [initialBarbeiros, setInitialBarbeiros] = useState([]);
    const [filteredBarbeiros, setFilteredBarbeiros] = useState([]);

    const getBarbeiros = async() => {
        setRefresh(true);
        try {
            const res = await getBarbeirosByServico(props.route.params?.barbeariaID, props.route.params?.servicoID);
            setInitialBarbeiros(res.data);
            setFilteredBarbeiros(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, ocorreu um erro ao carregar os barbeiros, contate o suporte");
        }
        setRefresh(false);
    }

    const onRefresh = () => {
        getBarbeiros();
    }

    useEffect(() => {
        if(isFocused) { 
            getBarbeiros();
        }
    }, [props, isFocused]);

	const filterBarbeiroByNome = (search) => {
		let oldArray = initialBarbeiros;
		let newArray = oldArray.filter(e => (new RegExp(search)).test(e.Usr_Nome));

		if (search !== '') {
			setFilteredBarbeiros(newArray);
		} else {
			setFilteredBarbeiros(oldArray);
		}
	}

    const renderItem = (item) => {
        return (
            <View key={item.Usr_Codigo} style={style.renderItemBarbeiro}>
                {item.Usr_FotoPerfil!==null&&item.Usr_FotoPerfil!==""?
                <Image style={style.image} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${item.Usr_FotoPerfil}`}}/>
                :<Image style={style.image} source={perfil}/>}
                <View style={{flex:1, padding: 10}}>
                    <Text style={style.textTitleBarb}>{item.Usr_Nome}</Text>
                    {item.BarbB_Especialidade!==""&&item.BarbB_Especialidade!==null?<Text style={[style.textTitleBarb, { color: '#000', fontSize: 16 }]}>{item.BarbB_Especialidade}</Text>:null}      
                    {item.Usr_Contato!==""&&item.Usr_Contato!==null?<Text style={style.textSubtitleBarb}>{`Contato: ${globalFunction.formataTelefone(item.Usr_Contato)}`}</Text>:null}
                    <StarRate starRating={item.Aval_Rate}/>
                    <TouchableOpacity style={style.buttonRenderItem} onPress={() => props.navigation.navigate("AgendamentoHorario", { barbeariaID: item.Barb_Codigo, barbeiroID: item.Usr_Codigo, servicoID: props.route.params?.servicoID })}>
                        <Text style={[style.textSubtitleBarb, {marginRight: 5}]}>Selecionar barbeiro</Text>
                        <MAIcon name="arrow-forward" size={30} color={'#2B513B'}></MAIcon>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => onRefresh()}/> }
            >
                <Text style={style.textTitle}>ESCOLHA UM BARBEIRO</Text>
                <View style={style.headerView}>
                    <TextInput
                    style={style.input}
                    mode='flat'
                    activeOutlineColor='#BA6213'
                    label="Pesquisar"
                    theme={{ colors: { placeholder: "#BA6213", text: '#BA6213', primary: '#BA6213' } }}
                    left={<TextInput.Icon color="#BA6213" name="magnify"/>}
                    onChangeText={(search) => filterBarbeiroByNome(search)}
                    />
                </View>
                <View style={{padding: 10}}>
                    {JSON.stringify(filteredBarbeiros) !== "[]"?
                    <>   
                        {filteredBarbeiros.map((e) => renderItem(e))}
                    </>
                    :<Text style={[style.textSubTitle, { textAlign: 'center' }]}>{refresh?"Carregando barbeiros...":"Não há barbeiros disponíveis"}</Text>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
    
export default AgendamentoBarbeiro;