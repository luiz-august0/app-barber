import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Alert, Image, TouchableNativeFeedback, StyleSheet } from "react-native";
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { Card } from "react-native-paper";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { getImagensServico } from "../services/api";
import AbsoluteModal from "./AbsoluteModal";

const ServicoComponent = ({nome, valor, tempo ,id}) => {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0)
    const isCarousel = useRef(null);
	

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

    const renderItem = ({ item }) => {
        return (
            <TouchableNativeFeedback onPress={() => Alert.alert('clicou')} >
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
            <Card>
                <Card.Title title={nome} 
                            subtitle={`Valor: R$${valor}\nTempo: ${tempo}min`}
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
}

const style = StyleSheet.create({
	itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
    itemServico: {
        width: 300, 
        height: 350, 
        marginBottom: 25
    }
})

export default ServicoComponent;