import React, { useRef, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

const PreviewImage = ({arrayImages}) => {
    const [index, setIndex] = useState(0)
    const isCarousel = useRef(null);

    const renderItem = ({ item }) => {
        return (
            <View>
                <Image style={style.itemImage} source={{ uri: item.Img_Url  }} />
            </View>
        )
    }

    return (
        <View style={style.container}>
            <Carousel
                layout="default"
                layoutCardOffset={10}
                data={arrayImages}
                sliderWidth={300}
                itemWidth={300}
                renderItem={renderItem}
                onSnapToItem={(index) => setIndex(index)}
            />
            <Pagination
                dotsLength={arrayImages.length}
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
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        height: "100%", 
        marginBottom: 25
    },
	itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    }
})

export default PreviewImage;