import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator, FlatList, SafeAreaView, RefreshControl } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import style from "./style";
import { deleteServicoBarbeiro, getBarbeariaCategorias, getServicosBarbeiro, postServicoBarbeiro } from "../../services/api";
import AbsoluteModal from "../../components/AbsoluteModal";
import globalFunction from "../../globalFunction";

const ServicosBarbeiro = (props) => {
	const [categorias, setCategorias] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [servicos, setServicos] = useState([]);
	const [loadingCategorias, setLoadingCategorias] = useState(false);
	const [loadingServicos, setLoadingServicos] = useState(false);
	const [loadingSubmit, setLoadingSubmit] = useState(false);

	const getDataCategorias = async() => {
		setLoadingCategorias(true);
        try {
            const response = await getBarbeariaCategorias(props.route.params?.barbeariaID);
			setCategorias(response.data);
        } catch (error) {
			Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao carregar as categorias de serviço, contate o suporte');
        }
		setLoadingCategorias(false);
    }

	const getDataServicos = async(id) => {
		setLoadingServicos(true);
        try {
			let array = [];
            const response = await getServicosBarbeiro(props.route.params?.barbeiroID, props.route.params?.barbeariaID, id);
			response.data.map((e) => array.push({Serv_Codigo: e.Serv_Codigo, Serv_Nome: e.Serv_Nome, ServCat_Codigo: e.ServCat_Codigo, Serv_Valor: e.Serv_Valor, Minutos: e.Minutos, Vinculado: e.Vinculo==1?true:false}));
			setServicos(array);
        } catch (error) {
			Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao carregar os serviços da categoria selecionada, contate o suporte');
        }
		setLoadingServicos(false);
	}

	const handleClickServico = (id) => {
		let array = [];
		servicos.map((e) => {
			if (e.Serv_Codigo == id) {
				array.push({Serv_Codigo: e.Serv_Codigo, Serv_Nome: e.Serv_Nome, ServCat_Codigo: e.ServCat_Codigo, Serv_Valor: e.Serv_Valor, Minutos: e.Minutos, Vinculado: e.Vinculado?false:true});
			} else {
				array.push({Serv_Codigo: e.Serv_Codigo, Serv_Nome: e.Serv_Nome, ServCat_Codigo: e.ServCat_Codigo, Serv_Valor: e.Serv_Valor, Minutos: e.Minutos, Vinculado: e.Vinculado});
			}
		})
		setServicos(array);
	}

	useEffect(() => {
        getDataCategorias();
    }, []);

	const handlePressOut = () => {
		setModalVisible(false);
		setServicos([]);
	}

	const handleSelect = (cod) => {
		getDataServicos(cod);
		setModalVisible(true)
	}

	const RenderItem = ({id, nome, valor, duracao, vinculado}) => {
        return (
            <TouchableOpacity key={id} style={style.buttonViewServico} onPress={() => handleClickServico(id)}>
				<View style={style.viewButtonServico}>
					<Text style={style.textViewServico}>{nome}</Text>
					<Text style={[style.textViewServico, {fontSize: 14, fontFamily: 'Manrope-Regular',}]}>{`Valor: R$${globalFunction.PointPerComma(parseFloat(valor).toFixed(2).toString())}\nTempo: ${duracao}min`}</Text>
				</View>
				<View style={style.buttonSelectServico}>
					<FIcon name={vinculado?`check-circle`:`circle-thin`} size={25} color={'#05A94E'}></FIcon>
				</View>
            </TouchableOpacity>
        )
    }

	const handleSubmit = async() => {
		setLoadingSubmit(true);
		let arrayVinculos = servicos.filter(e => e.Vinculado == true);
		
		try {
			await deleteServicoBarbeiro(props.route.params?.barbeiroID, props.route.params?.barbeariaID);
			for (let i = 0; i < arrayVinculos.length; i++) {
				const e = arrayVinculos[i];
				await postServicoBarbeiro(props.route.params?.barbeiroID, props.route.params?.barbeariaID, e.Serv_Codigo);
			}
			Alert.alert('Atenção', 'Serviços vinculados com sucesso');
		} catch (error) {
			Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao carregar os serviços da categoria selecionada, contate o suporte');
		}
		setLoadingSubmit(false);
		setModalVisible(false);
		setServicos([]);
	}

	return (
		<SafeAreaView style={style.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={loadingCategorias} onRefresh={() => getDataCategorias()}/> }
			>	
				{JSON.stringify(categorias) !== "[]"?
				<>
					<Text style={style.textTitle}>Categorias</Text>
					{categorias.map((e) => {
						return (
							<View key={e.ServCat_Codigo} style={style.categoriaComponent}>
								<View style={style.categoriaView}>
									<View style={{width: '60%'}}>
										<Text style={style.textCategoria} >{e.ServCat_Nome}</Text>
									</View>
									<View style={style.categoriaViewButtons}>
										<TouchableOpacity style={style.buttonCategoriaComponent} onPress={() => handleSelect(e.ServCat_Codigo)}>
											<Text style={style.textCategoriaButton}>Selecionar</Text>
											<MIcon name="arrow-forward" size={25} color={'#05A94E'}></MIcon>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						)
					})}
					<AbsoluteModal width={'100%'} handlePressOut={handlePressOut} modalVisible={modalVisible}>
						{!loadingServicos?
						<>
							{JSON.stringify(servicos) !== "[]"?
							<>
								<Text style={[style.textTitle, {fontSize: 18, marginTop: 0}]}>Selecione os serviços que serão vinculados ao barbeiro</Text>
								<FlatList
									style={{width: '110%'}}
									data={servicos}
									renderItem={({item}) => <RenderItem id={item.Serv_Codigo} nome={item.Serv_Nome} valor={item.Serv_Valor} duracao={item.Minutos} vinculado={item.Vinculado}/>}
									keyExtractor={item => item.Serv_Codigo}
								/>
								<TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={[style.confirmButton, {backgroundColor: loadingSubmit?'gray':'#05A94E'}]} onPress={() => {!loadingSubmit?handleSubmit():null}}>
									{loadingSubmit?<ActivityIndicator/>:<Text style={[ style.textButton, { color: "#fff", fontSize: 14 }]}>Confirmar</Text>}
								</TouchableOpacity>
							</>
							:<Text style={[style.text, {fontSize: 14, color: '#000'}]}>Não há serviços cadastrados para a categoria selecionada</Text>}
						</>
						:<ActivityIndicator/>}
					</AbsoluteModal>
				</>
				:<Text style={[style.textTitle, {fontSize: 18}]}>Não há categorias de serviço cadastradas</Text>}
			</ScrollView>
		</SafeAreaView>
	)
}

export default ServicosBarbeiro;