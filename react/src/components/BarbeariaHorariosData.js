import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from "@react-navigation/native";
import { getBarbeariaHorariosDia, getHorarios } from "../services/api";
import Dropdown from "./DropDown";

const BarbeariaHorariosData = ({ barbeariaID, id }, props) => {
	const isFocused = useIsFocused();
	const [horarioInicial, setHorarioInicial] = useState();
	const [horarioFinal, setHorarioFinal] = useState();
	const [dataHorariosDia, setDataHorariosDia] = useState([]);
	const [addMode, setAddMode] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [seqInEdit, setSeqInEdit] = useState('');
	const [horarios, setHorarios] = useState([]);

	const getData = async(id) => {
		try {
			const resHorariosDia = await getBarbeariaHorariosDia(barbeariaID, id);
			setDataHorariosDia(resHorariosDia.data);
			const dataHorarios = await getHorarios();
			setHorarios(dataHorarios.data);
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if(isFocused) { 
			getData(id);
		}
	}, [props, isFocused]);

	const onPressEdit = (seq, hrInicio, hrFim) => {
		setSeqInEdit('');
		setEditMode(false);
		setSeqInEdit(seq);
		setEditMode(true);
		setHorarioInicial(hrInicio);
		setHorarioFinal(hrFim);
	}

	if (JSON.stringify(dataHorariosDia) == '[]') {
		return (
			<Text style={[style.viewItemText, { color: '#000' }]}>
				Fechado
			</Text>)
	} else {
		return (
			<>
			{dataHorariosDia.map((e) => (
				<View style={{flexDirection: "row"}} key={e.BarbH_Seq}>
					<View>
						<Text style={{fontSize: 14}}>Horário inicial</Text>
						{(editMode)&&(e.BarbH_Seq == seqInEdit)?
						<Dropdown label="Horário" data={horarios} onSelect={setHorarioInicial} initialValue={{label: horarioInicial.toString(), text:  horarioInicial.toString()}} dropdownWidth={100}/>:
						<View style={style.viewItem}>
							<Text style={style.viewItemText}>
								{e.BarbH_HoraInicio}
							</Text>
						</View>}
					</View>
					<View style={{marginLeft: 10}}>
						<Text style={{fontSize: 14}}>Horário final</Text>
						{(editMode)&&(e.BarbH_Seq == seqInEdit)?
						<Dropdown label="Horário" data={horarios} onSelect={setHorarioFinal} initialValue={{label: horarioFinal.toString(), text:  horarioFinal.toString()}} dropdownWidth={100}/>:
						<View style={style.viewItem}>
							<Text style={style.viewItemText}>
								{e.BarbH_HoraFim}
							</Text>
						</View>}
					</View>
					<View style={{flexDirection: "row", marginLeft: 10}}>
						{!editMode?
						<>
							<TouchableOpacity style={style.buttonItem} onPress={() => onPressEdit(e.BarbH_Seq, e.BarbH_HoraInicio, e.BarbH_HoraFim)}>
								<MIcon name="edit" size={25} color={'#e65c00'}></MIcon>	
							</TouchableOpacity>
							<TouchableOpacity style={style.buttonItem}>
								<MIcon name="delete" size={25} color={'red'}></MIcon>	
							</TouchableOpacity>
						</>
						:
						<>
							{e.BarbH_Seq == seqInEdit?
							<>
								<TouchableOpacity style={style.buttonItem} onPress={() => { setEditMode(false); setSeqInEdit(''); }}>
									<MIcon name="cancel" size={25} color={'red'}></MIcon>	
								</TouchableOpacity>
								<TouchableOpacity style={style.buttonItem}>
									<MIcon name="check-circle" size={25} color={'#05A94E'}></MIcon>	
								</TouchableOpacity>
							</>
							:null}
						</>
						}
					</View>
				</View>
			))}
			</>
		)
	}
}

const style = StyleSheet.create({
	buttonItem: {
		alignContent: "center", 
		alignItems: "center", 
		justifyContent: "center", 
		paddingHorizontal: 15, 
		marginTop: '15%'
	},
	viewItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#404040',
		height: 40,
		width: 100,
		paddingHorizontal: 10,
		borderRadius: 10
	},
	viewItemText: {
		flex: 1,
		textAlign: 'center',
		color: '#ffff'
	}
});

export default BarbeariaHorariosData;