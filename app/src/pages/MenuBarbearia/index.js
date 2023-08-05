import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Linking, RefreshControl, SafeAreaView } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MAIcon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from "@react-navigation/native";
import globalFunction from "../../globalFunction";
import style from "./style";
import { getDadosBarbearia } from "../../services/api";

const MenuBarbearia = (props) => {
	const isFocused = useIsFocused();
	const [state, setState] = useState({'nome': '', 'rua': '', 'numero': '', 'bairro': '', 'cidade': '', 
										'uf': '', 'cep': '', 'lat': '', 'lng': ''});
	const [image, setImage] = useState(null);
	const [refresh, setRefresh] = useState(false);

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

	return (
		<SafeAreaView style={style.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getDataBarbearia(props.route.params?.barbeariaID)}/> }
			>
				<View style={style.imageContainer}>
					{image!==null?<Image source={image} style={style.image}/>:null}
				</View>
				<Text style={style.textTitle}>{state.nome}</Text>
				<View style={{flex: 1}}>
					<View style={style.viewButtons}>
						<TouchableOpacity
						style={style.button}
						onPress={() => props.navigation.navigate('Agendamentos')}
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
						style={[style.button, { height: 200 }]}
						onPress={() => Linking.openURL(`https://maps.google.com?q=${state.lat},${state.lng}`)}
						>
							<MIcon name="google-maps" size={70} color={'#BA6213'}></MIcon>
							<Text style={style.text}>VISUALIZAR NO MAPA</Text>
							<Text style={[style.text, { fontSize: 12, fontFamily: 'Manrope-Regular' }]}>{`${state.rua}, ${state.numero} - ${state.bairro}, ${state.cidade} - ${state.uf}, ${state.cep}`}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default MenuBarbearia;