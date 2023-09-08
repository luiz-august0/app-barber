import React, { useEffect, useState } from "react";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import style from "./style";
import { useIsFocused } from "@react-navigation/native";
import { Image, Text, View } from "react-native";
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
                                {e.Barb_LogoUrl!==null&&e.Barb_LogoUrl!==""?
                                <Image style={style.imageCallout} source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Barb_LogoUrl}`}}/>
                                :<Image style={style.imageCallout} source={perfil}/>}
                                <Text style={style.textTitleBarb}>{e.Barb_Nome}</Text>
                                <Text style={style.textSubtitleBarb}>{`${e.Barb_Rua}, ${e.Barb_Numero} - ${e.Barb_Bairro}, ${e.Barb_Cidade} - ${e.Barb_UF}`}</Text>
                                {e.Distance!==0?<Text style={[style.textSubtitleBarb, {fontFamily: 'Manrope-Bold', color: '#2B513B'}]}>{`Distância: ${distance}`}</Text>:null}
                                <FlexibleStarRate starRating={e.Aval_Rate} size={32}/>
                            </Callout>
                        </Marker>
                    )
                })}
            </MapView>
        </View>
    )
}
    
export default AgendamentoMapa;