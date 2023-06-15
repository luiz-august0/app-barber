import React, { useState } from "react";
import { ScrollView, RefreshControl, SafeAreaView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import style from "./style";
import Dropdown from "../../components/DropDown";

const ordens = [
    {
        label: "Nome",
        text: "Nome"
    },
    {
        label: "Distância",
        text: "Distância"
    }
]

const initialOrdemState = {label: 'Distância', text: 'Distância'};

const AgendamentoBarbearia = () => {
    const [loading, setLoading] = useState(false);
    const [ordem, setOrdem] = useState(initialOrdemState);

    return (
        <SafeAreaView style={style.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={ <RefreshControl refreshing={loading} onRefresh={() => {}}/> }
            >
                <Text style={style.textTitle}>Escolha uma barbearia</Text>
                <View style={style.headerView}>
                    <TouchableOpacity style={style.button}>
                        <Text style={style.text}>Ver no mapa</Text>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity style={style.buttonFilter}>
                            <Text style={[style.text, { color: '#000', fontSize: 18 }]}>Filtrar</Text>
                            <MIcon name="filter" size={30} color={'#000'}></MIcon>
                        </TouchableOpacity>
                        <View style={{marginTop: 10}}>
                            <Text style={[style.text, { color: '#000', fontSize: 14 }]}>Ordenar por</Text>
                            <Dropdown label="Ordenação" data={ordens} onSelect={setOrdem} initialValue={initialOrdemState} dropdownWidth={Dimensions.get('window').width / 2.5}/>
                        </View>
                    </View>
                </View>
                <View style={{padding: 10}}>
                    <Text style={style.textSubTitle}>
                        Barbearias já visitadas
                    </Text>
                    <View style={{height: 2, backgroundColor: '#000'}}></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
    
export default AgendamentoBarbearia;