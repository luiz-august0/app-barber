import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import MAIcon from 'react-native-vector-icons/MaterialIcons';
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
	const [loading, setLoading] = useState(false);

	const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

	const getData= async() => {
		setLoading(true);
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
		setLoading(false);
    }

	useEffect(() => {
        if(isFocused) { 
            getData();
        }
    }, [props, isFocused]);

	return (
		<ScrollView style={{ backgroundColor: globalStyles.main_color }}>
			<View style={style.container}>
				<View style={style.imageContainer}>
					<Image source={image} style={style.image}/>
				</View>
				<Text style={style.textTitleName}>{state.nome}</Text>
				<Text style={style.textTitleEspec}>{`Especialidade: ${state.espec}`}</Text>
				<TouchableOpacity
				style={style.button}
				onPress={() => props.navigation.navigate('DadosBarbeiro', { barbeariaID: props.route.params?.barbeariaID, barbeiroID: props.route.params?.barbeiroID })}
				>
					<Text style={style.text}>
						{`Dados de cadastro `}
						<MAIcon name="person" size={25} color={'#ffff'}></MAIcon>
					</Text>
				</TouchableOpacity>
			</View>
			{loading?<Loading/>:null}
		</ScrollView>
	)
}

export default MenuBarbeiro;