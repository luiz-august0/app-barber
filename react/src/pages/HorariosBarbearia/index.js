import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from "../../globalStyles";
import style from "./style";
import BarbeariaHorariosData from "../../components/BarbeariaHorariosData";

const HorariosBarbearia = (props) => {
	const data = [
		{
		  	id: 'DOM',
		  	label: 'Domingo',
		},
		{
			id: 'SEG',
			label: 'Segunda',
		},
		{
			id: 'TER',
			label: 'Terça'
		},
		{
			id: 'QUA',
			label: 'Quarta'
		},
		{
			id: 'QUI',
			label: 'Quinta'
		},
		{
			id: 'SEX',
			label: 'Sexta'
		},
		{
			id: 'SAB',
			label: 'Sábado'
		}
	];

	return (
		<ScrollView style={{backgroundColor: globalStyles.main_color}}>
			<View style={style.container}>
				{data.map((e) => (
					<View style={style.item} key={e.id}>
						<Text style={style.textItem}>{e.label}</Text>
						<BarbeariaHorariosData barbeariaID={props.route.params?.barbeariaID} id={e.id}/>
					</View>
				))}
			</View>
		</ScrollView>
	)
}

export default HorariosBarbearia;