import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Alert, SafeAreaView, RefreshControl } from "react-native";
import MAIcon from 'react-native-vector-icons/MaterialIcons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";
import globalStyles from "../../globalStyles";
import style from "./style";
import perfil from "../../img/perfil.png";
import { getDataBarbeiro } from "../../services/api";
import Loading from "../../components/Loading";

const MenuBarbeiro = (props) => {
	const isFocused = useIsFocused();
	const [state, setState] = useState({'nome': '', 'espec': ''});
	const [image, setImage] = useState(null);
	const [refresh, setRefresh] = useState(false);

	const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

	const getData= async() => {
		setRefresh(true);
        try {
            const response = await getDataBarbeiro(props.route.params?.barbeariaID, props.route.params?.barbeiroID);
            if (response.data[0].Usr_FotoPerfil !== '' && response.data[0].Usr_FotoPerfil !== null) {
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${response.data[0].Usr_FotoPerfil}`})
            } else {
                setImage(perfil);
            }
			setValueState('nome', response.data[0].Usr_Nome);
			setValueState('espec', response.data[0].BarbB_Especialidade);
        } catch (error) {
			Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao carregar os dados do barbeiro, contate o suporte' );
        }
		setRefresh(false);
    }

	useEffect(() => {
        if(isFocused) { 
            getData();
        }
    }, [props, isFocused]);

	return (
		<SafeAreaView style={style.container}>
			<ScrollView 
				showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getData()}/> }	
			>
				<View style={style.imageContainer}>
					<Image source={image} style={style.image}/>
				</View>
				<Text style={style.textTitle}>{state.nome}</Text>
				<Text style={style.textTitleEspec}>{`Especialidade: ${state.espec}`}</Text>
				<View style={{flex: 1}}>
					<View style={style.viewButtons}>
						<TouchableOpacity
						style={style.button}
						onPress={() => props.navigation.navigate('DadosBarbeiro', { barbeariaID: props.route.params?.barbeariaID, barbeiroID: props.route.params?.barbeiroID })}
						>
							<MAIcon name="person" size={80} color={'#BA6213'}></MAIcon>
							<Text style={style.text}>DADOS DE CADASTRO</Text>
						</TouchableOpacity>
						<TouchableOpacity
						style={style.button}
						onPress={() => props.navigation.navigate('ServicosBarbeiro', { barbeariaID: props.route.params?.barbeariaID, barbeiroID: props.route.params?.barbeiroID })}
						>
							<MIcon name="scissors-cutting" size={80} color={'#BA6213'}></MIcon>
							<Text style={style.text}>SERVIÇOS VINCULADOS</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default MenuBarbeiro;