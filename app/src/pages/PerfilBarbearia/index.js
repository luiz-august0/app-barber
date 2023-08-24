import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Linking, RefreshControl, SafeAreaView } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";
import style from "./style";
import { getAvaliacoes, getContatosBarbearia, getDadosBarbearia } from "../../services/api";
import globalFunction from "../../globalFunction";
import FlexibleStarRate from "../../components/FlexibleStarRate";
import perfil from "../../img/perfil.png";
import moment from "moment";
import 'moment/locale/pt-br';

const PerfilBarbearia = (props) => {
	const isFocused = useIsFocused();
	const [barbeariaData, setBarbeariaData] = useState([]);
	const [contatos, setContatos] = useState([]);
	const [avaliacoes, setAvaliacoes] = useState([]);
	const [avaliacoesComentario, setAvaliacoesComentarios] = useState([]);
	const [totalAvaliacaoes, setTotalAvaliacoes] = useState(0);
	const [refresh, setRefresh] = useState(false);

	const getDataBarbearia = async(id) => {
		setRefresh(true);
        try {
            const resBarb = await getDadosBarbearia(id);
			setBarbeariaData(resBarb.data[0]);
				
			const resContatos = await getContatosBarbearia(id);
			setContatos(resContatos.data);

			const resAvaliacoes = await getAvaliacoes(id);
			const dataAvaliacoes = resAvaliacoes.data[0][0];
			setAvaliacoes(dataAvaliacoes);
			setAvaliacoesComentarios(resAvaliacoes.data[1]);
			setTotalAvaliacoes(dataAvaliacoes.Aval_Rate1 + dataAvaliacoes.Aval_Rate2 + dataAvaliacoes.Aval_Rate3 + dataAvaliacoes.Aval_Rate4 + dataAvaliacoes.Aval_Rate5);

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

	const renderAvaliacoes = () => {
		let avalArray = [1, 2, 3, 4, 5];

		return (
			<View>
				{avalArray.map((e) => {
					let avalIndex = 0;

					switch (e) {
						case 1:
							avalIndex = avaliacoes.Aval_Rate1;
							break;
						case 2:
							avalIndex = avaliacoes.Aval_Rate2;
							break;
						case 3:
							avalIndex = avaliacoes.Aval_Rate3;
							break;
						case 4:
							avalIndex = avaliacoes.Aval_Rate4;
							break;		
						case 5:
							avalIndex = avaliacoes.Aval_Rate5;
							break;						
						default:
							break;
					}

					return (
						<View key={e} style={{flexDirection: "row"}}>
							<FlexibleStarRate starRating={e} size={24}/>
							<Text style={[style.textCenter, { fontSize: 16}]}>:</Text>
							<Text style={[style.textCenter, { fontSize: 16}]}>{`  ${avalIndex} avaliações`}</Text>
						</View>
					)
				})}
			</View>
		)
	}

	return (
		<SafeAreaView style={style.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={refresh} onRefresh={() => getDataBarbearia(props.route.params?.barbeariaID)}/> }
			>
				{barbeariaData.Barb_LogoUrl!==''&&barbeariaData.Barb_LogoUrl!==null?<Image source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${barbeariaData.Barb_LogoUrl}`}} style={style.image}/>:null}
				<Text style={style.textTitle}>{barbeariaData.Barb_Nome}</Text>
				<View style={style.centerView}>
					<TouchableOpacity style={[style.button, { backgroundColor: '#2B513B', marginBottom: 20 }]} onPress={() => props.navigation.navigate("AgendamentoServico", { barbeariaID: props.route.params?.barbeariaID})}>
						<View style={{flex: 1}}>
							<Text style={style.text}>REALIZAR AGENDAMENTO</Text>
						</View>
						<MIcon name="calendar-cursor" size={35} color={'#FFCA9F'}></MIcon>
					</TouchableOpacity>
					<TouchableOpacity style={style.button} onPress={() => Linking.openURL(`https://maps.google.com?q=${barbeariaData.Barb_GeoLatitude},${barbeariaData.Barb_GeoLongitude}`)}>
						<View style={{flex: 1}}>
							<Text style={style.text}>VISUALIZAR NO MAPA</Text>
							<Text style={[style.text, {fontSize: 12}]}>{`${barbeariaData.Barb_Rua}, ${barbeariaData.Barb_Numero} - ${barbeariaData.Barb_Bairro}, ${barbeariaData.Barb_Cidade} - ${barbeariaData.Barb_UF}`}</Text>
						</View>
						<MIcon name="google-maps" size={35} color={'#FFCA9F'}></MIcon>
					</TouchableOpacity>
				</View>
				<View style={{padding: 10}}>
					{JSON.stringify(contatos)!=="[]"?
					<>
						<Text style={style.textSubTitle}>CONTATOS DA BARBEARIA</Text>
						<View style={style.separatedComponent}></View>
						{contatos.map((e) => (
							<View key={e.BarbC_Contato} style={style.contatosView}>
								<Text style={style.textCenter}>{`${e.BarbC_Descricao}:`}</Text>
								<Text style={[style.textCenter, { fontFamily: 'Manrope-Regular', marginLeft: 5 }]}>{globalFunction.formataTelefone(e.BarbC_Contato)}</Text>
							</View>
						))}
					</>:null}
					{JSON.stringify(avaliacoesComentario)!=="[]"?
					<>					
						<Text style={[style.textSubTitle, { marginTop: 50 }]}>AVALIAÇÕES DA BARBEARIA</Text>
						<View style={style.separatedComponent}></View>
						<View style={style.avaliacoesView}>
							{renderAvaliacoes()}
							<View style={style.resumoAvaliacoesView}>
								<Text style={[style.textTitle, { marginBottom: 0 }]}>{globalFunction.PointPerComma(parseFloat(avaliacoesComentario[0].Aval_RateAvg).toFixed(2).toString())}</Text>
								<FlexibleStarRate starRating={parseFloat(avaliacoesComentario[0].Aval_RateAvg).toFixed(2)} size={24}/>
								<Text style={[style.textCenter, { fontFamily: 'Manrope-Regular', fontSize: 14}]}>{`${totalAvaliacaoes} avaliações`}</Text>
							</View>
						</View>
						{avaliacoesComentario.map((e) => {
							return (
								<View key={e.Aval_Date+e.Usr_Codigo} style={{padding: 10, backgroundColor: "#FDEBDD", marginVertical: 10}}>
									<View style={{flexDirection: "row", alignItems: "center", marginBottom: 10}}>
										{e.Usr_FotoPerfil!==null&&e.Usr_FotoPerfil!==""?
										<Image style={style.imageUsuario} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Usr_FotoPerfil}`}}/>
										:<Image style={style.imageUsuario} source={perfil}/>}
										<Text style={[style.textCenter, { marginLeft: 5, fontSize: 14 }]}>{e.Usr_Nome}</Text>
									</View>
									<View style={{flexDirection: "row", alignItems: "center", marginBottom: 10}}>
										<FlexibleStarRate starRating={parseFloat(e.Aval_Rate).toFixed(2)} size={18}/>
										<Text style={[style.textCenter, { marginLeft: 5, fontSize: 14, fontFamily: 'Manrope-Regular' }]}>{moment(e.Aval_Date.toString()).fromNow()}</Text>
									</View>
								</View>
							)
						})}
					</>:null}
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default PerfilBarbearia;