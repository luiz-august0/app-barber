import React, { createRef, useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";
import globalStyles from "../../globalStyles";
import style from "./style";
import { getDadosBarbearia } from "../../services/api";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import Dropdown from "../../components/DropDown";

const HorariosBarbearia = (props, ref) => {
	const isFocused = useIsFocused();
	const [horarioInicial, setHorarioInicial] = useState();
	const [horarioFinal, setHorarioFinal] = useState();
	const [loading, setLoading] = useState(false);
	const data = [
		{
		  	label: 'DOM',
		  	text: 'Domingo',
		},
		{
			label: 'SEG',
		  	text: 'Segunda',
		},
		{
			label: 'TER',
		  	text: 'Terça'
		}
	];

	const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

	const refreshData = async(id) => {
		setLoading(true);
        
		setLoading(false);
    }

	useEffect(() => {
        if(isFocused) { 
            refreshData(props.route.params?.barbeariaID);
        }
    }, [props, isFocused]);

	return (
		<View style={style.container}>
			{!loading?
			<FlatList
				style={{backgroundColor: globalStyles.main_color}}
				data={data}
				renderItem={({item}) => (
				<View style={style.item}>
					<Text style={{fontSize: 18, fontFamily: 'Montserrat-Bold'}}>{item.text}</Text>
      				<Dropdown label="Horário" data={data} onSelect={setHorarioInicial} dropdownWidth={150}/>
				</View>
				)}
		  	/>:<ActivityIndicator/>}
		</View>
	)
}

export default HorariosBarbearia;