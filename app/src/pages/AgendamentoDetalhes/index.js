import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, Alert, TouchableOpacity, View, Image } from "react-native";
import style from "./style";
import perfil from "../../img/perfil.png";
import Loading from "../../components/Loading";
import globalFunction from "../../globalFunction";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import { getDataBarbeiro, showBarbeariaServico } from "../../services/api";
import SmallStarRate from "../../components/SmallStarRate";
import ServicoComponent from "../../components/ServicoComponent";

const AgendamentoDetalhes = (props) => {
	const isFocused = useIsFocused();
	const [barbeiroData, setBarbeiroData] = useState([]);
	const [servicoData, setServicoData] = useState([]);
	const [loading, setLoading] = useState(false);

	const getData = async() => {
		setLoading(true);
		try {
			const resBarb = await getDataBarbeiro(props.route.params?.barbeariaID, props.route.params?.barbeiroID);
			const resServico = await showBarbeariaServico(props.route.params?.servicoID);
			setBarbeiroData(resBarb.data[0]);
			setServicoData(resServico.data[0]);
		} catch (error) {
			console.log(error);
			Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os detalhes do agendamento, contate o suporte");
		}
		setLoading(false);
	}
	//props.usuario.state.id

	useEffect(() => {
        if(isFocused) { 
            getData();
        }
    }, [props, isFocused]);

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