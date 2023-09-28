import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Linking, RefreshControl, SafeAreaView, Alert } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MAIcon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from "@react-navigation/native";
import globalFunction from "../../globalFunction";
import style from "./style";
import { deleteBarbearia, getDadosBarbearia } from "../../services/api";
import Loading from "../../components/Loading";

const MenuBarbearia = (props) => {
	const isFocused = useIsFocused();
	const [state, setState] = useState({'nome': '', 'rua': '', 'numero': '', 'bairro': '', 'cidade': '', 
										'uf': '', 'cep': '', 'lat': '', 'lng': ''});
	const [image, setImage] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

	const getDataBarbearia = async(id) => {
		setRefresh(true);
        try {
            const response = await getDadosBarbearia(id);
            if (response.data[0].Barb_LogoUrl !== '' && response.data[0].Barb_LogoUrl !== null) {
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${response.data[0].Barb_LogoUrl}`})
            }

			setValueState('nome', response.data[0].Barb_Nome);
			setValueState('rua', response.data[0].Barb_Rua);
			setValueState('numero', response.data[0].Barb_Numero);
			setValueState('bairro', response.data[0].Barb_Bairro);
			setValueState('cidade', response.data[0].Barb_Cidade);
			setValueState('uf', response.data[0].Barb_UF);
			setValueState('lat', response.data[0].Barb_GeoLatitude);
			setValueState('lng', response.data[0].Barb_GeoLongitude);
			setValueState('cep', globalFunction.formataCampo(response.data[0].Barb_CEP, "00.000-000"));
        } catch (error) {
            console.log(error)
        }
		setRefresh(false);
    }

	useEffect(() => {
        if(isFocused) { 
            getDataBarbearia(props.route.params?.barbeariaID);
        }
    }, [props, isFocused]);

	const handleDeleteBarbearia = () => {
		const deleteRegister = async() => {
			setDeleting(true);
            try {
				await deleteBarbearia(props.route.params?.barbeariaID);
                Alert.alert('Atenção', 'Barbearia excluída com sucesso');
				props.navigation.goBack(null);
            } catch (error) {
				if (error.message === "Request failed with status code 401") {
					Alert.alert('Atenção', 'Não foi possível excluir a barbearía pois há agendamentos que ainda irão ocorrer');
                }
            }
			setDeleting(false);
        }

        Alert.alert('Confirmação', 'Deseja realmente excluir todos os dados da barbearia? (Atenção, este processo é irreversível)',
		[
			{text: 'Não', style: 'cancel'},
			{text: 'Sim', onPress: () => deleteRegister()},
		],
		{ cancelable: true });
	}

	if (deleting) {
		return <Loading/>
	} else {
		return (
			<SafeAreaView style={style.container}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getDataBarbearia(props.route.params?.barbeariaID)}/> }
				>
					{image!==null?<Image source={image} style={style.image}/>:null}
					<Text style={style.textTitle}>{state.nome}</Text>
					<View style={{flex: 1}}>
						<View style={style.viewButtons}>
							<TouchableOpacity
							style={style.button}
							onPress={() => props.navigation.navigate('Agendamentos', { barbeariaID: props.route.params?.barbeariaID })}
							>
								<MIcon name="calendar-month" size={80} color={'#BA6213'}></MIcon>
								<Text style={style.text}>AGENDAMENTOS</Text>
							</TouchableOpacity>
							<TouchableOpacity
							style={style.button}
							onPress={() => props.navigation.navigate('HorariosBarbearia',{ barbeariaID: props.route.params?.barbeariaID })}
							>
								<MIcon name="timetable" size={80} color={'#BA6213'}></MIcon>
								<Text style={style.text}>HORÁRIOS</Text>
							</TouchableOpacity>
						</View>
						<View style={style.viewButtons}>
							<TouchableOpacity
							style={style.button}
							onPress={() => props.navigation.navigate('DadosBarbearia', { barbeariaID: props.route.params?.barbeariaID })}
							>
								<MIcon name="office-building" size={80} color={'#BA6213'}></MIcon>
								<Text style={style.text}>DADOS DE CADASTRO</Text>
							</TouchableOpacity>
							<TouchableOpacity
							style={style.button}
							onPress={() => props.navigation.navigate('Barbeiros',{ barbeariaID: props.route.params?.barbeariaID })}
							>
								<MAIcon name="person" size={80} color={'#BA6213'}></MAIcon>
								<Text style={style.text}>BARBEIROS</Text>
							</TouchableOpacity>
						</View>
						<View style={style.viewButtons}>
							<TouchableOpacity
							style={style.button}
							onPress={() => props.navigation.navigate('CategoriasServico',{ barbeariaID: props.route.params?.barbeariaID })}
							>
								<MIcon name="scissors-cutting" size={80} color={'#BA6213'}></MIcon>
								<Text style={style.text}>SERVIÇOS</Text>
							</TouchableOpacity>
							<TouchableOpacity
							style={style.button}
							onPress={() => Linking.openURL(`https://maps.google.com?q=${state.lat},${state.lng}`)}
							>
								<MIcon name="google-maps" size={70} color={'#BA6213'}></MIcon>
								<Text style={style.text}>VISUALIZAR NO MAPA</Text>
							</TouchableOpacity>
						</View>
						<View style={{alignItems: "center", justifyContent: "center"}}>
							<TouchableOpacity style={style.buttonDelete} onPress={() => handleDeleteBarbearia()}>
								<Text style={style.textButtonDelete}>Excluir Barbearia</Text>
								<MAIcon name="delete" size={50} color={'#71150D'}></MAIcon>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		)
	}
}

export default MenuBarbearia;