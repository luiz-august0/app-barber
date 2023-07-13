import React, { useState, useEffect } from "react";
import { ScrollView, SafeAreaView, Text, Alert, View, Image, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import style from "./style";
import perfil from "../../img/perfil.png";
import Loading from "../../components/Loading";
import globalFunction from "../../globalFunction";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import { getDadosBarbearia, getDataBarbeiro, postAgendamento, showBarbeariaServico } from "../../services/api";
import SmallStarRate from "../../components/SmallStarRate";
import ServicoComponent from "../../components/ServicoComponent";
import { Card } from "react-native-paper";

const AgendamentoDetalhes = (props) => {
	const isFocused = useIsFocused();
	const [barbeiroData, setBarbeiroData] = useState([]);
	const [servicoData, setServicoData] = useState([]);
	const [barbeariaData, setBarbeariaData] = useState([]);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [loading, setLoading] = useState(false);

	const getData = async() => {
		setLoading(true);
		try {
			const resBarb = await getDataBarbeiro(props.route.params?.barbeariaID, props.route.params?.barbeiroID);
			const resServico = await showBarbeariaServico(props.route.params?.servicoID);
			const resBarbearia = await getDadosBarbearia(props.route.params?.barbeariaID);
			setBarbeiroData(resBarb.data[0]);
			setServicoData(resServico.data[0]);
			setBarbeariaData(resBarbearia.data[0]);
		} catch (error) {
			Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os detalhes do agendamento, contate o suporte");
		}
		setLoading(false);
	}

	useEffect(() => {
        if(isFocused) { 
            getData();
        }
    }, [props, isFocused]);

	const handleSubmit = async() => {
		setLoadingSubmit(true);

		try {
			await postAgendamento(props.route.params?.barbeariaID, props.route.params?.barbeiroID, props.usuario.state.id, props.route.params?.servicoID, props.route.params?.tempServ, props.route.params?.horaInicio, globalFunction.formatDateToSql(props.route.params?.data));
			Alert.alert("Atenção", "Agendamento realizado com sucesso");
			props.navigation.navigate('HomeNav');
		} catch (error) {
			if (error.message === "Request failed with status code 405") {
				Alert.alert("Atenção", "Não foi possível gravar o agendamento pois já existe um com o horário selecionado, por favor selecione outro horário");
				props.navigation.goBack(null);
			} else {
				Alert.alert("Atenção", "Ops, Ocorreu um erro ao gravar o agendamento, contate o suporte");
			}
		}

		setLoadingSubmit(false);
	}

	if (loading) { 
		return <Loading/> 
	} else {
		return (
			<SafeAreaView style={style.container}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={style.headerDetails}>
						<View style={style.headerContent}>
							<Text style={style.text}>Data:</Text>
							<Text style={[style.text, { fontFamily: 'Manrope-Bold' }]}>{` ${globalFunction.formatStringDate(new Date(props.route.params?.data.toString()))} às ${props.route.params?.horaInicio}`}</Text>
						</View>
						<View style={style.headerContent}>
							<Text style={[style.text, { marginHorizontal: 5 }]}>Barbeiro:</Text>
							<View style={style.headerContentBarbeiro}>
								{barbeiroData.Usr_FotoPerfil!==""&&barbeiroData.Usr_FotoPerfil!==null?
								<Image style={style.image} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${barbeiroData.Usr_FotoPerfil}`}}/>:
								<Image style={style.image} source={perfil}/>}
								<View style={style.componentBarbeiro}>
									<Text style={style.textBarb}>{barbeiroData.Usr_Nome}</Text>
									<SmallStarRate starRating={barbeiroData.Aval_Rate}/>
								</View>
							</View>
						</View>
					</View>	
					<View style={style.viewContent}>
						<View style={style.headerSubtitleComponent}>
							<Text style={style.textTitle}>BARBEARIA</Text>
						</View>
						<View style={style.separateComponent}></View>
						<View style={style.barbeariaComponent}>
							{barbeariaData.Barb_LogoUrl!==""&&barbeariaData.Barb_LogoUrl!==null?
							<Image style={style.barbeariaComponentImage} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${barbeariaData.Barb_LogoUrl}`}}/>:
							<Image style={style.barbeariaComponentImage} source={perfil}/>}
							<Card style={style.cardBarbearia}>
								<Card.Title 
									title={barbeariaData.Barb_Nome} 
									subtitle={`${barbeariaData.Barb_Rua}, ${barbeariaData.Barb_Numero} - ${barbeariaData.Barb_Bairro}, ${barbeariaData.Barb_Cidade} - ${barbeariaData.Barb_UF}`}
									titleStyle={style.textTitleBarbeariaComponent}
									subtitleStyle={style.textSubtitleBarbeariaComponent}
									titleNumberOfLines={0} 
									subtitleNumberOfLines={0}/>
								<TouchableOpacity style={style.barbeariaButtonComponent}>
									<Text style={[style.text, {marginRight: 5}]}>Ver perfil da barbearia</Text>
									<MIcon name="eye" size={30} color={'#000'}></MIcon>
                    			</TouchableOpacity>
								<TouchableOpacity style={style.barbeariaButtonComponent} onPress={() => Linking.openURL(`https://maps.google.com?q=${barbeariaData.Barb_GeoLatitude},${barbeariaData.Barb_GeoLongitude}`)}>
									<Text style={[style.text, {marginRight: 5}]}>Visualizar no mapa</Text>
									<MIcon name="google-maps" size={30} color={'#000'}></MIcon>
                    			</TouchableOpacity>
							</Card>
						</View>
						<View style={[style.headerSubtitleComponent, { marginTop: 20 }]}>
							<Text style={style.textTitle}>SERVIÇO</Text>
						</View>
						<View style={style.separateComponent}></View>
						<ServicoComponent 
							props={props}
							nome={servicoData.Serv_Nome} 
							valor={servicoData.Serv_Valor} 
							tempo={servicoData.Minutos} 
							id={props.route.params?.servicoID} 
							idCategoria={servicoData.ServCat_Codigo}
						/>
					</View>
					<View style={style.viewButtons}>
						<TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={style.button} onPress={() => {!loadingSubmit?handleSubmit():null}}>
							{loadingSubmit?<ActivityIndicator/>:<Text style={style.textButton}>CONFIRMAR</Text>}
						</TouchableOpacity>
					</View>
				</ScrollView>
			</SafeAreaView>
		)
	}
}

const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}

export default connect(mapStateToProps, null)(AgendamentoDetalhes);