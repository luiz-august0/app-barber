import React, { useEffect, useState } from "react";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import style from "./style";
import { useIsFocused } from "@react-navigation/native";
import { Image, Text, View } from "react-native";
import {Svg, Image as ImageSvg, Defs, ClipPath, Circle} from 'react-native-svg';
import * as Location from 'expo-location';
import perfil from "../../img/perfil.png";
import FlexibleStarRate from "../../components/FlexibleStarRate";

const AgendamentoMapa = (props) => {
    const isFocused = useIsFocused();
    const [initialRegion, setInitialRegion] = useState({
        region: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
        }
    })
    const [barbearias, setBarbearias] = useState([]);

    const getLocation = async() => {
        let location = await Location.getLastKnownPositionAsync({});
        if (location == null) {
            location = await Location.getCurrentPositionAsync({});
        }

        setInitialRegion({
            region: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.009,
                longitudeDelta: 0.009,
            }
        })
    }

    useEffect(() => {
        if(isFocused) { 
            let barbeariaArray = [];

            props.route.params?.barbeariasVisitadas.map((e) => {
                barbeariaArray.push(e)
            })

            props.route.params?.barbeariasPesq.map((e) => {
                barbeariaArray.push(e)
            })

            setBarbearias(barbeariaArray);
            getLocation();
        }
    }, [props, isFocused]);

    const CustomCallout = ({item, distance}) => {
        const ImageElement = ({image}) => (
            <Svg height={140} width={140}>
            <Defs>
                <ClipPath id="clip">
                    <Circle cx="50%" cy="50%" r="40%" />
                </ClipPath>
            </Defs>
            <ImageSvg
            x="5%"
            y="5%"
            width="90%"
            height="90%"
            preserveAspectRatio="xMidYMid slice"
            href={image}
            clipPath="url(#clip)"
            />
            </Svg>
        )

        return (
            <>
                {item.Barb_LogoUrl!==null&&item.Barb_LogoUrl!==""? 
                <ImageElement image={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${item.Barb_LogoUrl}`}}/>:
                <ImageElement image={perfil}/>}
                <Text style={style.textTitleBarb}>{item.Barb_Nome}</Text>
                <Text style={style.textSubtitleBarb}>{`${item.Barb_Rua}, ${item.Barb_Numero} - ${item.Barb_Bairro}, ${item.Barb_Cidade} - ${item.Barb_UF}`}</Text>
                {item.Distance!==0?<Text style={[style.textSubtitleBarb, {fontFamily: 'Manrope-Bold', color: '#2B513B'}]}>{`Distância: ${distance}`}</Text>:null}
                <FlexibleStarRate starRating={item.Aval_Rate} size={32}/>
            </>
        )
    }

    return (
        <View style={style.container}>
            <MapView 
            style={style.map} 
            region={initialRegion.region}
            showsUserLocation
            loadingEnabled
            zoomEnabled={true}
            provider={PROVIDER_GOOGLE}
            >
                {barbearias.map((e, index) => {
                    let distance = '';
                    if (e.Distance < 1000) {
                        distance = `${e.Distance.toFixed(0).toString()}m`;
                    } else {
                        distance = `${(e.Distance / 1000).toFixed(2).toString().replace('.', ',')}km`
                    }

                    return (
                        <Marker key={index} coordinate={{latitude: e.Barb_GeoLatitude, longitude: e.Barb_GeoLongitude}}>
                            <View style={style.marker}>
                                {e.Barb_LogoUrl!==null&&e.Barb_LogoUrl!==""?
                                <Image style={style.image} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Barb_LogoUrl}`}}/>
                                :<Image style={style.image} source={perfil}/>}
                                <Text style={{fontFamily: 'Manrope-Bold'}}>{e.Barb_Nome}</Text>
                            </View>
                            <Callout style={style.renderItemBarbearia} onPress={() => props.navigation.navigate("PerfilBarbearia", { barbeariaID: e.Barb_Codigo})}>
                                <CustomCallout item={e} distance={distance}/>
                            </Callout>
                        </Marker>
                    )
                })}
            </MapView>
        </View>
    )
}
    
export default AgendamentoMapa;