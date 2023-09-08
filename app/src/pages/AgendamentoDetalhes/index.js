import React, { useState, useEffect } from "react";
import { ScrollView, SafeAreaView, Text, Alert, View, Image, TouchableOpacity, Linking, ActivityIndicator, RefreshControl, TextInput } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import style from "./style";
import perfil from "../../img/perfil.png";
import Loading from "../../components/Loading";
import globalFunction from "../../globalFunction";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import { getDadosBarbearia, getDataBarbeiro, getUsuario, postAgendamento, postAvaliacao, showBarbeariaServico, updateStatusAgendamento } from "../../services/api";
import FlexibleStarRate from "../../components/FlexibleStarRate";
import ServicoComponent from "../../components/ServicoComponent";
import { Card } from "react-native-paper";
import AbsoluteModal from "../../components/AbsoluteModal";
import StarRateOptions from "../../components/StarRateOptions";

const AgendamentoDetalhes = (props) => {
	const isFocused = useIsFocused();
	const [usuarioData, setUsuarioData] = useState([]);
	const [clienteData, setClienteData] = useState([]);
	const [servicoData, setServicoData] = useState([]);
	const [barbeariaData, setBarbeariaData] = useState([]);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [loadingSubmitRate, setLoadingSubmitRate] = useState(false);
	const [loadingSubmitRL, setLoadingSubmitRL] = useState(false);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);	
	const [starRating, setStarRating] = useState(0);
	const [comment, setComment] = useState("");

	const getData = async() => {
		setLoading(true);
		try {
			if (props.usuario.state.tipo!=="F") {
				const res = await getDataBarbeiro(props.route.params?.barbeariaID, props.route.params?.barbeiroID)
				setUsuarioData(res.data[0]);

				if (props.route.params?.usuarioID) {					
					const resCliente = await getUsuario(props.route.params?.usuarioID);
					setClienteData(resCliente.data[0]);
				}
			} else {
				const res = await getUsuario(props.route.params?.usuarioID);
				setUsuarioData(res.data[0])
			}
			const resServico = await showBarbeariaServico(props.route.params?.servicoID);
			const resBarbearia = await getDadosBarbearia(props.route.params?.barbeariaID);
			setServicoData(resServico.data[0]);
			setBarbeariaData(resBarbearia.data[0]);
		} catch (error) {
			Alert.alert("Atenção", "Ops, ocorreu um erro ao carregar os detalhes do agendamento, contate o suporte");
		}
		setLoading(false);
	}

	useEffect(() => {
        if(isFocused) { 
            getData();
        }
    }, [props, isFocused]);

	const handleSubmit = async(statusParam) => {
		if (statusParam == "RL") {
			setLoadingSubmitRL(true);
		} else {
			setLoadingSubmit(true); 
		}

		if (!props.route.params?.agdmID) {
			try {
				await postAgendamento(props.route.params?.barbeariaID, props.route.params?.barbeiroID, props.usuario.state.id, props.route.params?.servicoID, props.route.params?.tempServ, props.route.params?.horaInicio, globalFunction.formatDateToSql(props.route.params?.data));
				Alert.alert("Atenção", "Agendamento realizado com sucesso");
				props.navigation.navigate('Home');
			} catch (error) {
				if (error.message === "Request failed with status code 405") {
					Alert.alert("Atenção", "O agendamento não pôde ser efetuado pois já há um agendamento no horário escolhido. Por favor, selecione outro horário disponível");
					props.navigation.goBack(null);
				} 
				else if (error.message === "Request failed with status code 401") {
					Alert.alert("Atenção", "O agendamento não pôde ser efetuado pois o horário escolhido não está disponível. Por favor, selecione outro horário");
					props.navigation.goBack(null);
				}
				else {
					Alert.alert("Atenção", "Ops, ocorreu um erro ao gravar o agendamento, contate o suporte");
				}
			}
		} else {
			let status = "";
			let statusMessage = "";
			let confirmMessage = "";

			if (props.usuario.state.tipo == "B" || props.usuario.state.tipo == "F") {
				if (statusParam == "RL") {
					status = statusParam;
				} else {
					status = "R";
				}
			} else {
				status = "C";
			}

			switch (status) {
				case "R":
					statusMessage = "recusado com sucesso"
					confirmMessage = "Deseja realmente recusar o agendamento ?"
					break;
				case "C":
					statusMessage = "cancelado com sucesso"
					confirmMessage = "Deseja realmente cancelar o agendamento ?"
					break;
				case "RL":
					statusMessage = "marcado como realizado"
					confirmMessage = "Deseja realmente marcar como realizado o agendamento ?"
				default:
					break;
			}

			const postStatus = async() => {
				try {
					await updateStatusAgendamento(props.route.params?.agdmID, status);
					Alert.alert("Atenção", `Agendamento ${statusMessage}`);
					props.navigation.goBack(null);
				} catch (error) {
					Alert.alert("Atenção", "Ops, ocorreu um erro ao cancelar o agendamento, contate o suporte");
				}
			}

			Alert.alert('Confirmação', confirmMessage,
			[
				{text: 'Não', style: 'cancel'},
				{text: 'Sim', onPress: () => postStatus()},
			],
			{ cancelable: true });
		}

		if (statusParam == "RL") {
			setLoadingSubmitRL(false);
		} else {
			setLoadingSubmit(false); 
		}
	}

	const cleanState = () => {
        setModalVisible(false);
		setComment("");
		setStarRating(0);
	}

	const handlePressOut = () => {
		cleanState();
    }

	const handleSubmitRate = async() => {
		if (starRating == 0) {
			Alert.alert("Atenção", "Não foi selecionado nenhum ranking para a avaliação");
			return;
		}

		setLoadingSubmitRate(true);	
		try {
			await postAvaliacao(props.usuario.state.id, props.route.params?.barbeariaID, props.route.params?.barbeiroID, comment, starRating);
			Alert.alert("Atenção", "Avaliação enviada com sucesso");
		} catch (error) {
			Alert.alert("Atenção", "Ops, ocorreu um erro ao enviar a avaliação, contate o suporte");
		}
		setLoadingSubmitRate(false);	
		cleanState();
	}

	const renderInformacoesCliente = (item) => {
		return (
			<>
				<View style={style.headerSubtitleComponent}>
					<Text style={[style.textTitle, { fontSize: 18 }]}>INFORMAÇÕES DO CLIENTE</Text>
				</View>
				<View style={style.separateComponent}></View>
				<View style={style.barbeariaComponent}>
					{item.Usr_FotoPerfil!==""&&item.Usr_FotoPerfil!==null?
					<Image style={style.barbeariaComponentImage} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${item.Usr_FotoPerfil}`}}/>:
					<Image style={style.barbeariaComponentImage} source={perfil}/>}
					<Card style={style.cardBarbearia}>
						<Card.Title 
							title={item.Usr_Nome} 
							subtitle={`Email: ${item.Usr_Email}${item.Usr_Contato!==""&&item.Usr_Contato!==null&&item.Usr_Contato!==undefined?`\nContato: ${globalFunction.formataTelefone(item.Usr_Contato)}`:""}`}
							titleStyle={style.textTitleBarbeariaComponent}
							subtitleStyle={style.textSubtitleBarbeariaComponent}
							titleNumberOfLines={0} 
							subtitleNumberOfLines={0}/>
					</Card>
				</View>	
			</>
		)
	}

	if (loading) { 
		return <Loading/> 
	} else {
		return (
			<SafeAreaView style={style.container}>
				<ScrollView 
				showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl onRefresh={() => getData()}/> }
				>
					<View style={style.headerDetails}>
						<View style={style.headerContent}>
							<Text style={style.text}>Data:</Text>
							<Text style={[style.text, { fontFamily: 'Manrope-Bold' }]}>{` ${globalFunction.formatStringDate(new Date(props.route.params?.data.toString()))} às ${props.route.params?.horaInicio}`}</Text>
						</View>
						<View style={style.headerContent}>
							<Text style={[style.text, { marginHorizontal: 5 }]}>{props.usuario.state.tipo!=="F"?"Barbeiro:":"Cliente:"}</Text>
							<View style={style.headerContentBarbeiro}>
								{usuarioData.Usr_FotoPerfil!==""&&usuarioData.Usr_FotoPerfil!==null?
								<Image style={style.image} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${usuarioData.Usr_FotoPerfil}`}}/>:
								<Image style={style.image} source={perfil}/>}
								<View style={style.componentBarbeiro}>
									<Text style={style.textBarb}>{usuarioData.Usr_Nome}</Text>
									{props.usuario.state.tipo!=="F"?<FlexibleStarRate starRating={usuarioData.Aval_Rate} size={18}/>:null}
								</View>
							</View>
						</View>
					</View>	
					<View style={style.viewContent}>
						{props.usuario.state.tipo=="C"?
						<>
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
									{props.route.params?.agdmID?
									<View style={{alignItems: "center", justifyContent: "center"}}>
										<TouchableOpacity style={style.barbeariaButtonComponent} onPress={() => props.navigation.navigate("PerfilBarbearia", { barbeariaID: barbeariaData.Barb_Codigo})}>
											<Text style={[style.textTitle, {marginRight: 5, fontSize: 18}]}>Ver perfil da barbearia</Text>
											<MIcon name="eye" size={30} color={'#FFCA9F'}></MIcon>
										</TouchableOpacity>
									</View>:null}
								</Card>
							</View>
						</>
						:
						<>
							{renderInformacoesCliente(props.usuario.state.tipo!=="F"?clienteData:usuarioData)}
						</>}
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
						{!props.route.params?.agdmID?
						<TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={style.button} onPress={() => {!loadingSubmit?handleSubmit():null}}>
							{loadingSubmit?<ActivityIndicator/>:<Text style={style.textButton}>CONFIRMAR</Text>}
						</TouchableOpacity>
						:
						<>
							{props.usuario.state.tipo=="C"&&props.route.params?.status=="RL"?
							<TouchableOpacity style={style.button} onPress={() => setModalVisible(true)}>
								<Text style={style.textButton}>AVALIAR SERVIÇO</Text>
							</TouchableOpacity>:null}
							{props.usuario.state.tipo!=="C"&&props.route.params?.status=="P"?
							<TouchableOpacity activeOpacity={loadingSubmitRL ? 1 : 0.7} style={style.button} onPress={() => {!loadingSubmitRL?handleSubmit("RL"):null}}>
								{loadingSubmitRL?<ActivityIndicator/>:<Text style={style.textButton}>MARCAR COMO REALIZADO</Text>}
							</TouchableOpacity>:null}
							{props.route.params?.status=="P"?
							<TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={[style.button, { marginTop: 20, backgroundColor: "#71150D" }]} onPress={() => {!loadingSubmit?handleSubmit():null}}>
								{loadingSubmit?<ActivityIndicator/>:<Text style={style.textButton}>{props.usuario.state.tipo!=="C"?"RECUSAR":"CANCELAR"}</Text>}
							</TouchableOpacity>:null}
						</>}
					</View>
					<AbsoluteModal handlePressOut={handlePressOut} modalVisible={modalVisible} width={'100%'}>
						<Text style={style.text}>Avalie o serviço que foi realizado</Text>
						<StarRateOptions onChangeRate={setStarRating}/>
						<TextInput
						style={style.input}
						placeholder="Escreva aqui um comentário sobre o serviço"
						placeholderTextColor={"gray"}
						value={comment}
						multiline={true}
						onChangeText={(comment) => setComment(comment)}
						/>
						<TouchableOpacity activeOpacity={loadingSubmitRate ? 1 : 0.7} style={[style.button, { marginTop: 30 }]} onPress={() => {!loadingSubmitRate?handleSubmitRate():null}}>
							{loadingSubmitRate?<ActivityIndicator/>:<Text style={style.textButton}>ENVIAR</Text>}
						</TouchableOpacity>
					</AbsoluteModal>
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