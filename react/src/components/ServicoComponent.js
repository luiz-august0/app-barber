import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image, TouchableNativeFeedback, StyleSheet, Text } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { Card } from "react-native-paper";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { getImagensServico } from "../services/api";
import PreviewImage from "./PreviewImage";
import AbsoluteModal from "./AbsoluteModal";
import globalFunction from "../globalFunction";

const ServicoComponent = ({props, nome, valor, tempo, id, idCategoria, screenNavigation, barbeariaID}) => {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0)
    const isCarousel = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
	
    const getImages = async() => {
        let array = [];
        const res = await getImagensServico(id);
        const data = res.data;
        data.map((e) => {
            array.push({Img_Url: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Img_Url}`});
        })

        if(JSON.stringify(array) !== "[]") {
            setImages(array);
        } else {
            setImages([{Img_Url: `https://res.cloudinary.com/dvwxrpftt/image/upload/v1682604126/barber_qmb8bp.png`}])
        }
    }

    useEffect(() => {
        getImages();
    }, []);

    const handlePressOut = () => {
        setModalVisible(false);
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableNativeFeedback onPress={() => setModalVisible(true)} >
                <Image style={style.itemImage} source={{ uri: item.Img_Url  }} />
            </TouchableNativeFeedback>
        )
    }

    return (
        <View style={style.itemServico}>
            <Carousel
                layout="default"
                layoutCardOffset={10}
                data={images}
                sliderWidth={300}
                itemWidth={300}
                renderItem={renderItem}
                onSnapToItem={(index) => setIndex(index)}
            />
            <Pagination
                containerStyle={{position: "absolute"}}
                dotsLength={images.length}
                activeDotIndex={index}
                carouselRef={isCarousel}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.92)'
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
            <Card style={{backgroundColor: barbeariaID?'#404040':'#fff'}}>
                <Card.Title title={nome} 
                            subtitle={`Valor: R$${globalFunction.PointPerComma(parseFloat(valor).toFixed(2).toString())}\nTempo: ${tempo}min`}
                            titleStyle={{textAlign: "center", color: barbeariaID?'#fff':'#000'}}
                            subtitleStyle={{textAlign: "center", color: barbeariaID?'#fff':'#000'}}
                            titleNumberOfLines={0} 
                            subtitleNumberOfLines={0}/>
                <TouchableOpacity 
                style={style.buttonSelect}
                onPress={() => props.navigation.navigate(screenNavigation, { servicoID: id, categoriaID: idCategoria, barbeariaID: barbeariaID})}>
                    <Text style={[style.textSubtitle, { color: barbeariaID?'#fff':'#000' }]}>Selecionar</Text>
                    <MIcon name="arrow-forward" size={30} color={'#05A94E'}></MIcon>
                </TouchableOpacity>
            </Card>
            <AbsoluteModal modalVisible={modalVisible} width={'90%'} handlePressOut={handlePressOut}>
                <PreviewImage arrayImages={images}/>
            </AbsoluteModal>
        </View>
    )
}

const style = StyleSheet.create({
	itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    itemServico: {
        width: 300, 
        height: 350, 
        marginBottom: 25,
    },
    buttonSelect: {
        flexDirection: "row",
        alignItems: "center", 
        padding: 5, 
        marginTop: 10, 
        justifyContent: "flex-end"
    },
    textSubtitle: {
        fontSize: 16,
        fontFamily: 'Manrope-Regular',
        marginRight: 5
    }
})

export default ServicoComponent;