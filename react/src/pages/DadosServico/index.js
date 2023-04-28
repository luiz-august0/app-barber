import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView } from "react-native";
import { FlatList } from 'react-native-gesture-handler';
import { TextInput, HelperText } from 'react-native-paper';
import globalStyles from "../../globalStyles";
import * as ImagePicker from 'expo-image-picker';
import style from "./style";
import FIcon from 'react-native-vector-icons/Feather';
import MIcon from 'react-native-vector-icons/MaterialIcons';

const DadosServico = () => {
    const [state, setState] = useState({'nome': null, 'valor': null, 'duracao': '15'});
    const [errors, setErrors] = useState({'nome': null, 'valor': null, 'duracao': null});
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    useEffect(() => {

    }, []);

    const pickImage = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
            quality: 1,
        })
        
        if (!res.cancelled) {
            const file = `data:${res.type}/jpeg;base64,${res.base64}`;

            try {
                setLoading(true);
                const responseImage = await updateUsuarioFoto(props.usuario.state.id, file);
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.base64});
                updateStoreUsuario();
                setLoading(false);
            } catch (error) {
                Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao realizar o upload da imagem.' )
                setLoading(false);
            }
        }
        
    }

    const pickCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
          Alert.alert("Atenção", "Você recusou este app para acessar sua câmera!");
          return;
        }

        let res = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
            quality: 1,
        })
        
        if (!res.cancelled) {
            const file = `data:${res.type}/jpeg;base64,${res.base64}`;

            try {
                setLoading(true);
                const responseImage = await updateUsuarioFoto(props.usuario.state.id, file);
                setImage({uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.base64});
                updateStoreUsuario();
                setLoading(false);
            } catch (error) {
                Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao realizar o upload da imagem.' )
                setLoading(false);
            }
        }
        
    }

    const DATA = [
        {
            Img_Url: `https://res.cloudinary.com/dvwxrpftt/image/upload/v1682604126/barber_qmb8bp.png`,
        },
        {
            Img_Url: `https://res.cloudinary.com/dvwxrpftt/image/upload/v1680726109/bchzwr0ynwxxkz2vur02.jpg`,
        }
    ];

    const RenderItem = ({url}) => {
        return (
            <View style={style.itemImage}>
                <Image style={style.image} source={{ uri: url  }}/>
                <TouchableOpacity style={{alignItems: 'center', marginTop: 10, justifyContent: "center"}}>
                    <MIcon name="delete" size={35} color={'red'}></MIcon>
                    <Text style={style.text}>Excluir</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                <FlatList
                    data={DATA}
                    horizontal={true}
                    renderItem={({item}) => <RenderItem url={item.Img_Url} />}
                    keyExtractor={item => item.Img_Url}
                />
                <TouchableOpacity style={[style.buttonPickImage, { marginTop: 30 }]} onPress={pickImage}>
                    <MIcon
                    name="add-a-photo" 
                    size={20} 
                    color={'#fff'}/>
                    <Text style={[ style.text, { color: "#fff", marginLeft: 10 }]}>
                        Selecionar imagem
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.buttonPickImage, { marginTop: 20,marginBottom: 60 }]} onPress={pickCamera}>
                    <MIcon
                    name="add-a-photo" 
                    size={20} 
                    color={'#fff'}/>
                    <Text style={[ style.text, { color: "#fff", marginLeft: 10 }]}>
                        Acessar câmera
                    </Text>
                </TouchableOpacity>
                <TextInput
                style={style.input}
                mode='flat'
                activeOutlineColor='#fff'
                label="Nome"
                error={errors.nome !== null ? true : false}
                onFocus={() => handleError(null, 'nome')}
                theme={{ colors: { placeholder: `${state.nome!==null&&state.nome!==''?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" name="content-cut" />}
                value={state.nome}
                onChangeText={(nome) => setValueState('nome', nome)}
                />
                <HelperText type="error" visible={errors.nome !== null ? true : false}>
                    {errors.nome}
                </HelperText>
                <TextInput
                style={style.input}
                mode='flat'
                activeOutlineColor='#fff'
                label="Valor"
                keyboardType="decimal-pad"
                error={errors.valor !== null ? true : false}
                onFocus={() => handleError(null, 'valor')}
                theme={{ colors: { placeholder: `${state.valor!==null&&state.valor!==''?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
                left={<TextInput.Icon color="white" name="currency-brl" />}
                value={state.valor}
                onChangeText={(valor) => setValueState('valor', valor)}
                />
                <HelperText type="error" visible={errors.valor !== null ? true : false}>
                    {errors.valor}
                </HelperText>
                <View style={{flexDirection: "row", width: "70%"}}>
                    <View style={{flexDirection: "row"}} >
                        <TextInput
                        style={[style.input, { width: "88%" }]}
                        mode='flat'
                        activeOutlineColor='#fff'
                        label="Duração"
                        editable={false}
                        keyboardType="decimal-pad"
                        error={errors.duracao !== null ? true : false}
                        onFocus={() => handleError(null, 'duracao')}
                        theme={{ colors: { placeholder: `${state.duracao!==null&&state.duracao!==''?"white":"gray"}`, disabled: '#fff', text: 'white', primary: 'white' } }}
                        left={<TextInput.Icon color="white" name="clock-outline" />}
                        value={state.duracao}
                        onChangeText={(duracao) => setValueState('duracao', duracao)}
                        />
                    </View>
                    <View style={{justifyContent: "center", right: "35%"}}>
                        <Text style={style.text}>Minutos</Text>
                    </View>
                </View>
                <HelperText type="error" visible={errors.duracao !== null ? true : false}>
                    {errors.duracao}
                </HelperText>
                <View style={{flexDirection: "row", marginTop: 10}}>
                    <View>
                        <TouchableOpacity style={style.buttonMinusAdd}>
                            <FIcon
                            name="minus-circle" 
                            size={20} 
                            color={'#fff'}/>
                            <Text style={[ style.text, { color: "#fff" }]}>
                                15min
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginLeft: 10}}>
                        <TouchableOpacity style={style.buttonMinusAdd}>
                            <FIcon
                            name="plus-circle" 
                            size={20} 
                            color={'#fff'}/>
                            <Text style={[ style.text, { color: "#fff" }]}>
                                15min
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={style.viewSubmit}>
                    <TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={[style.button, {backgroundColor: loadingSubmit?'gray':'#05A94E'}]} onPress={() => {!loadingSubmit?handleSubmit():null}}>
                        {loadingSubmit?<ActivityIndicator/>:<Text style={[ style.text, { color: "#fff" }]}>Confirmar dados</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: "center", justifyContent: 'center'}}>
                        <MIcon name="delete" size={35} color={'red'}></MIcon>
                        <Text style={style.text}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default DadosServico;