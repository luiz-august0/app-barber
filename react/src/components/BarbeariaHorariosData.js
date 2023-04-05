import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from "@react-navigation/native";
import { deleteBarbeariaHorarioDia, getBarbeariaHorariosDia, getHorarios, postBarbeariaHorarioDia, updateBarbeariaHorarioDia } from "../services/api";
import Dropdown from "./DropDown";
import moment from "moment";

const initialHorarioState = {label: '', text: ''};

const BarbeariaHorariosData = ({ barbeariaID, id }, props) => {
	const isFocused = useIsFocused();
	const [horarioInicial, setHorarioInicial] = useState(initialHorarioState);
	const [horarioFinal, setHorarioFinal] = useState(initialHorarioState);
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
		setAddMode(false);
		setSeqInEdit('');
		setEditMode(false);
		setSeqInEdit(seq);
		setEditMode(true);
		setHorarioInicial({label: hrInicio, text: hrInicio});
		setHorarioFinal({label: hrFim, text: hrFim});
	}

	const onPressAdd = () => {
		setSeqInEdit('');
		setAddMode(false);
		setAddMode(true);
		setHorarioInicial(initialHorarioState);
		setHorarioFinal(initialHorarioState);
	}

	const onPressCancel = () => {
		setAddMode(false);
		setEditMode(false);
		setSeqInEdit('');
		setHorarioInicial(initialHorarioState);
		setHorarioFinal(initialHorarioState);
	}

	const handleSubmit = async() => {
		if (horarioInicial.text == '' && horarioFinal.text == '') {
			Alert.alert('Atenção', 'Horário inicial e horário final devem ser informados');
			return;
		}

		if (horarioInicial.text == '') {
			Alert.alert('Atenção', 'Horário inicial deve ser informado');
			return;
		}

		if (horarioFinal.text == '') {
			Alert.alert('Atenção', 'Horário final deve ser informado');
			return;
		}

		if (horarioInicial.text == horarioFinal.text) {
			Alert.alert('Atenção', 'Horário inicial e horário final não podem ser iguais');
			return;
		}

		const hrInicial = moment(horarioInicial.text, 'hh:mm:ss');
		const hrFinal = moment(horarioFinal.text, 'hh:mm:ss');

		if (!hrInicial.isBefore(hrFinal)) {
			Alert.alert('Atenção', 'Horário inicial não pode ser maior que o horário final');
			return;
		}

		try {
			if (seqInEdit !== '' && editMode) {
				console.log(horarioFinal.text.toString());
				await updateBarbeariaHorarioDia(seqInEdit, horarioInicial.text.toString(), horarioFinal.text.toString());
				Alert.alert('Atenção', 'Horário atualizado com sucesso');
			} else {
				await postBarbeariaHorarioDia(barbeariaID, id, horarioInicial.text.toString(), horarioFinal.text.toString());
				Alert.alert('Atenção', 'Horário inserido com sucesso');
			}			
			setAddMode(false);
			setEditMode(false);
			setSeqInEdit('');
			setHorarioInicial(initialHorarioState);
			setHorarioFinal(initialHorarioState);
			getData(id);
		} catch (error) {
			console.log(error)
		}
	}

	const handleDelete = (idSeq) => {
		const deleteRegister = async() => {
			try {
				await deleteBarbeariaHorarioDia(idSeq);
				setAddMode(false);
				setEditMode(false);
				setSeqInEdit('');
				setHorarioInicial(initialHorarioState);
				setHorarioFinal(initialHorarioState);
				getData(id);
			} catch (error) {
				console.log(error);
			}
		}

		Alert.alert('Confirmação', 'Deseja realmente excluir ?',
		[
			{text: 'Não', style: 'cancel'},
			{text: 'Sim', onPress: () => deleteRegister()},
		],
		{ cancelable: true }
	);
	}

	const viewInsert = () => {
		return (
			<View style={{flexDirection: "row", marginBottom: 10}}>
				<View>
					<Text style={{fontSize: 14}}>Horário inicial</Text>
					<Dropdown label="Horário" data={horarios} onSelect={setHorarioInicial} dropdownWidth={100}/>
				</View>
				<View style={{marginLeft: 10}}>
					<Text style={{fontSize: 14}}>Horário final</Text>
					<Dropdown label="Horário" data={horarios} onSelect={setHorarioFinal} dropdownWidth={100}/>
				</View>
				<View style={{flexDirection: "row", marginLeft: 10}}>
					<TouchableOpacity style={style.buttonItem} onPress={() => onPressCancel()}>
						<MIcon name="cancel" size={25} color={'red'}></MIcon>	
					</TouchableOpacity>
					<TouchableOpacity style={style.buttonItem} onPress={() => handleSubmit()}>
						<MIcon name="check-circle" size={25} color={'#05A94E'}></MIcon>	
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	if (JSON.stringify(dataHorariosDia) == '[]') {
		return (
			<View>
				<Text style={[style.viewItemText, { color: '#000', marginBottom: 10 }]}>
					Fechado
				</Text>
				{addMode?viewInsert():
				<TouchableOpacity style={{marginTop: 10}} onPress={() => onPressAdd()}>
					<MIcon name="add-circle" size={25} color={'#05A94E'}></MIcon>	
				</TouchableOpacity>}
			</View>
		)
	} else {
		return (
			<>
			{dataHorariosDia.map((e) => (
				<View style={{flexDirection: "row", marginBottom: 10}} key={e.BarbH_Seq}>
					<View>
						<Text style={{fontSize: 14}}>Horário inicial</Text>
						{(editMode)&&(e.BarbH_Seq == seqInEdit)?
						<Dropdown label="Horário" data={horarios} onSelect={setHorarioInicial} initialValue={horarioInicial} dropdownWidth={100}/>:
						<View style={style.viewItem}>
							<Text style={style.viewItemText}>
								{e.BarbH_HoraInicio}
							</Text>
						</View>}
					</View>
					<View style={{marginLeft: 10}}>
						<Text style={{fontSize: 14}}>Horário final</Text>
						{(editMode)&&(e.BarbH_Seq == seqInEdit)?
						<Dropdown label="Horário" data={horarios} onSelect={setHorarioFinal} initialValue={horarioFinal} dropdownWidth={100}/>:
						<View style={style.viewItem}>
							<Text style={style.viewItemText}>
								{e.BarbH_HoraFim}
							</Text>
						</View>}
					</View>
					<View style={{flexDirection: "row", marginLeft: 10}}>
						{(!editMode) && (!addMode)?
						<>
							<TouchableOpacity style={style.buttonItem} onPress={() => onPressEdit(e.BarbH_Seq, e.BarbH_HoraInicio, e.BarbH_HoraFim)}>
								<MIcon name="edit" size={25} color={'#e65c00'}></MIcon>	
							</TouchableOpacity>
							<TouchableOpacity style={style.buttonItem} onPress={() => handleDelete(e.BarbH_Seq)}>
								<MIcon name="delete" size={25} color={'red'}></MIcon>	
							</TouchableOpacity>
						</>
						:
						<>
							{e.BarbH_Seq == seqInEdit?
							<>
								<TouchableOpacity style={style.buttonItem} onPress={() => onPressCancel()}>
									<MIcon name="cancel" size={25} color={'red'}></MIcon>	
								</TouchableOpacity>
								<TouchableOpacity style={style.buttonItem} onPress={() => handleSubmit()}>
									<MIcon name="check-circle" size={25} color={'#05A94E'}></MIcon>	
								</TouchableOpacity>
							</>
							:null}
						</>
						}
					</View>
				</View>
			))}
			{addMode?viewInsert():
			<TouchableOpacity style={{marginTop: 10}} onPress={() => onPressAdd()}>
				<MIcon name="add-circle" size={25} color={'#05A94E'}></MIcon>	
			</TouchableOpacity>}
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