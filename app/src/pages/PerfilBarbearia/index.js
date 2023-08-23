import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Linking, RefreshControl, SafeAreaView } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";
import style from "./style";
import { getDadosBarbearia } from "../../services/api";

const PerfilBarbearia = (props) => {
	const isFocused = useIsFocused();
	const [barbeariaData, setBarbeariaData] = useState([]);
	const [refresh, setRefresh] = useState(false);

	const getDataBarbearia = async(id) => {
		setRefresh(true);
        try {
            const res = await getDadosBarbearia(id);
			const data = res.data[0];
			setBarbeariaData({Barb_Codigo: data.Barb_Codigo, Barb_Nome: data.Barb_Nome, Barb_Rua: data.Barb_Rua, Barb_Numero: data.Barb_Numero,
				Barb_Bairro: data.Barb_Bairro, Barb_Cidade: data.Barb_Cidade, Barb_UF: data.Barb_UF, Aval_Rate: data.Aval_Rate==null?0:data.Aval_Rate, Barb_LogoUrl: data.Barb_LogoUrl,
				Barb_GeoLatitude: data.Barb_GeoLatitude, Barb_GeoLongitude: data.Barb_GeoLongitude});

        } catch (error) {
            Alert.alert("Atenção", "Ops, ocorreu um erro ao carregar o perfil da barbearia, contate o suporte");
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
				{barbeariaData.Barb_LogoUrl!==''&&barbeariaData.Barb_LogoUrl!==null?<Image source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${barbeariaData.Barb_LogoUrl}`}} style={style.image}/>:null}
				<Text style={style.textTitle}>{barbeariaData.Barb_Nome}</Text>
				<View style={{alignItems: "center", justifyContent: "center"}}>
					<TouchableOpacity style={style.button} onPress={() => Linking.openURL(`https://maps.google.com?q=${barbeariaData.Barb_GeoLatitude},${barbeariaData.Barb_GeoLongitude}`)}>
						<View style={{flex: 1}}>
							<Text style={style.text}>VISUALIZAR NO MAPA</Text>
							<Text style={[style.text, {fontSize: 12}]}>{`${barbeariaData.Barb_Rua}, ${barbeariaData.Barb_Numero} - ${barbeariaData.Barb_Bairro}, ${barbeariaData.Barb_Cidade} - ${barbeariaData.Barb_UF}`}</Text>
						</View>
						<MIcon name="google-maps" size={35} color={'#FFCA9F'}></MIcon>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default PerfilBarbearia;