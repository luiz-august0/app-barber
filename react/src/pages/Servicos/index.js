import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from "react-native";
import style from "./style";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from "../../globalStyles";
import { getBarbeariaCategoriaServicos, getImagensServico } from "../../services/api";
import { useIsFocused } from "@react-navigation/native";
import { Card } from "react-native-paper";
import Carousel from "react-native-snap-carousel";

const Servicos = (props) => {
    const isFocused = useIsFocused();
    const [ servicos, setServicos ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const getServicos = async() => {
        setLoading(true);
        try {            
            const res = await getBarbeariaCategoriaServicos(props.route.params?.categoriaID);
            setServicos(res.data);
        } catch (error) {
            Alert.alert("Atenção", "Ops, Ocorreu um erro ao carregar os serviços, contate o suporte");
        }
        setLoading(false);
    }

    const renderItem = ({ item }) => {
        return (
            <View>
                <Image style={style.itemImage} source={{ uri: item.Img_Url  }} />
            </View>
        )
    }

    useEffect(() => {
        if(isFocused) { 
            getServicos();
        }
    }, [props, isFocused]);

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                <TouchableOpacity
                style={style.button}
                onPress={() => {}}
                >
                    <Text style={style.text}>Cadastrar Novo Serviço</Text>
                </TouchableOpacity>
                {JSON.stringify(servicos) !== "[]"?
                <>
                    {!loading?
                    <>
                        <Text style={style.textTitle}>Serviços</Text>
                        {servicos.map((e) => {
                            const getImages = () => {
                                let array = [];
                                const get = async() => {
                                    const res = await getImagensServico(e.Serv_Codigo);
                                    const data = res.data;
                                    data.map((e) => {
                                        array.push({Img_Url: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Img_Url}`});
                                    })
                                }
                                get();
                                return array;
                            }
                            const arrayImages = getImages();

                            return (
                                <View key={e.Serv_Codigo}>
                                    <Carousel
                                        layout="default"
                                        layoutCardOffset={10}
                                        data={arrayImages}
                                        sliderWidth={300}
                                        itemWidth={300}
                                        renderItem={renderItem}
                                    />
                                    <Card style={{width: 300, marginBottom: 25}}>
                                        <Card.Title title={e.Serv_Nome} 
                                                    subtitle={`Valor: R$${e.Serv_Valor}\nTempo: ${e.Minutos}min`}
                                                    titleStyle={{textAlign: "center"}}
                                                    subtitleStyle={{textAlign: "center"}}
                                                    titleNumberOfLines={0} 
                                                    subtitleNumberOfLines={0}/>
                                        <TouchableOpacity>
                                            <MIcon 
                                            style={{textAlign: "right", padding: 10}}
                                            name="arrow-forward" 
                                            size={35} 
                                            color={'#05A94E'}/>
                                        </TouchableOpacity>
                                    </Card>
                                </View>
                            )
                        })}
                    </>
                    :<ActivityIndicator style={{marginTop: '20%'}}/>}
                </>
                :null}
            </View>
        </ScrollView>
    )
}
    
export default Servicos;