import React, { useEffect, useState } from "react";
import { ScrollView, View, SafeAreaView, Text, TouchableOpacity, Alert, Image, Linking } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";
import globalStyles from "../../globalStyles";
import globalFunction from "../../globalFunction";
import style from "./style";
import perfil from "../../img/perfil.png";
import { getDadosBarbearia } from "../../services/api";

const MenuBarbearia = (props) => {
	const isFocused = useIsFocused();
	const [state, setState] = useState({'nome': null, 'rua': null, 'numero': null, 'bairro': null, 'cidade': null, 
										'uf': null, 'cep': null, 'lat': null, 'lng': null});
	const [image, setImage] = useState(null);

	const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

	const getDataBarbearia = async(id) => {
        try {
            const response = await getDadosBarbearia(id);
            if (response.data[0].Barb_LogoUrl !== '' && response.data[0].Barb_LogoUrl !== null) {
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${response.data[0].Barb_LogoUrl}`})
            } else {
                setImage(perfil);
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
            
        }
    }

	useEffect(() => {
        if(isFocused) { 
            getDataBarbearia(props.route.params?.barbeariaID);
        }
    }, [props, isFocused]);

	return (
		<ScrollView style={{ backgroundColor: globalStyles.main_color }}>
			<View style={style.container}>
				<View style={style.imageContainer}>
					<Image source={image} style={style.image}/>
				</View>
				<Text style={style.textTitle}>{state.nome}</Text>
                <TouchableOpacity
                style={style.button}
                onPress={() => Linking.openURL(`https://maps.google.com?q=${state.lat},${state.lng}`)}
                >
                    <Text style={style.text}>
						{`Visualizar no mapa `}
						<MIcon name="google-maps" size={25} color={'#ffff'}></MIcon>
					</Text>
					<Text style={[style.text, { fontSize: 12, fontFamily: 'Montserrat-Regular' }]}>{`${state.rua}, ${state.numero} - ${state.bairro}, ${state.cidade} - ${state.uf}, ${state.cep}`}</Text>
                </TouchableOpacity>
			</View>
		</ScrollView>
	)
}

export default MenuBarbearia;