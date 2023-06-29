import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView, Alert } from "react-native";
import { FlatList } from 'react-native-gesture-handler';
import { TextInput, HelperText } from 'react-native-paper';
import globalStyles from "../../globalStyles";
import * as ImagePicker from 'expo-image-picker';
import style from "./style";
import FIcon from 'react-native-vector-icons/Feather';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MAIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { deleteBarbeariaServico, deleteImagemServico, getImagensServico, postBarbeariaServico, postImagemServico, showBarbeariaServico, updateBarbeariaServico } from "../../services/api";
import globalFunction from "../../globalFunction";
import Loading from "../../components/Loading";

const DadosServico = (props) => {
    const [state, setState] = useState({'nome': null, 'valor': null, 'duracao': '15'});
    const [errors, setErrors] = useState({'nome': null, 'valor': null, 'duracao': null});
    const [images, setImages] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const setValueState = (input, value) => {
        setState(prevState => ({ ...prevState, [input]: value }));
    }

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const getDataServico = async() => {
        try {
            const res = await showBarbeariaServico(props.route.params?.servicoID);
            const data = res.data;
            setValueState('nome', data[0].Serv_Nome.toString());
            setValueState('valor', globalFunction.PointPerComma(parseFloat(data[0].Serv_Valor).toFixed(2).toString()));
            setValueState('duracao', data[0].Minutos.toString());
        } catch (error) {
            Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao trazer os dados do serviço');
        }
    }

    const getDataImages = async() => {
        try {
            let array = [];
            const res = await getImagensServico(props.route.params?.servicoID);
            const data = res.data;
            data.map((e) => {
                array.push({Img_Url: `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Img_Url}`, urlImg: e.Img_Url});
            })
    
            if(JSON.stringify(array) !== "[]") {
                setImages(array);
            } else {
                setImages([]);
            }
        } catch (error) {
            Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao trazer as imagens do serviço');
        }
    }

    useEffect(() => {
        const refresh = async() => {
            setLoading(true);
            await getDataServico();
            await getDataImages();
            setLoading(false);
        }

        if (props.route.params?.servicoID !== null && props.route.params?.servicoID !== '' && props.route.params?.servicoID !== undefined) {
            refresh();
        }
        
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
                setLoadingImage(true);
                if (props.route.params?.servicoID !== null && props.route.params?.servicoID !== '' && props.route.params?.servicoID !== undefined) {
                    const responseImage = await postImagemServico(props.route.params?.servicoID, file);
                    setImages([...images, {Img_Url: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.base64, type: res.type, urlImg: responseImage.data}]);
                } else {
                    setImages([...images, {Img_Url: res.uri, base64: res.base64, type: res.type, urlImg: res.uri}]);
                }
                setLoadingImage(false);
            } catch (error) {
                Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao realizar o upload da imagem.');
                setLoadingImage(false);
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
                setLoadingImage(true);
                if (props.route.params?.servicoID !== null && props.route.params?.servicoID !== '' && props.route.params?.servicoID !== undefined) {
                    const responseImage = await postImagemServico(props.route.params?.servicoID, file);
                    setImages([...images, {Img_Url: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, base64: res.base64, type: res.type, urlImg: responseImage.data}]);
                } else {
                    setImages([...images, {Img_Url: res.uri, base64: res.base64, type: res.type, urlImg: res.uri}]);
                }
                setLoadingImage(false);
            } catch (error) {
                Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao realizar o upload da imagem.' )
                setLoadingImage(false);
            }
        }
    }

    const handleSubmit = async() => {
        let isValid = true;

        handleError(null, 'duracao');

        if (state.nome == '' || state.nome == null) {
            handleError('Nome deve ser informado', 'nome')
            isValid = false;
        }

        if (state.valor == '' || state.valor == null) {
            handleError('Valor deve ser informado', 'valor');
            isValid = false;
        }

        if (parseFloat(state.valor) <= 0) {
            handleError('Valor deve ser maior que 0', 'valor');
            isValid = false;
        }

        if (state.duracao == '' || state.duracao == null) {
            handleError('Duração deve ser informada', 'duracao');
            isValid = false;
        }

        if (parseInt(state.duracao) <= 0) {
            handleError('Duração deve ser maior que 0', 'duracao');
            isValid = false;
        }

        if (isValid) {
            setLoadingSubmit(true);
            try {  
                if (props.route.params?.servicoID !== null && props.route.params?.servicoID !== '' && props.route.params?.servicoID !== undefined) {
                    await updateBarbeariaServico(props.route.params?.servicoID, state.nome, globalFunction.commaPerPoint(state.valor), globalFunction.minsToHHMMSS(state.duracao));
                    Alert.alert('Atenção', 'Serviço atualizado com sucesso');
                    props.navigation.navigate('Servicos', { categoriaID:  props.route.params?.categoriaID});
                } else {
                    const res = await postBarbeariaServico(state.nome, props.route.params?.categoriaID, globalFunction.commaPerPoint(state.valor), globalFunction.minsToHHMMSS(state.duracao));
                    
                    const postImages = async() => {
                        if (JSON.stringify(images) !== "[]") {
                            for (const e of images) {
                                await postImagemServico(res.data.insertId, `data:${e.type}/jpeg;base64,${e.base64}`); 
                            }
                        }
                    }
                    
                    await postImages();
                    Alert.alert('Atenção', 'Serviço cadastrado com sucesso');
                    props.navigation.navigate('Servicos', { categoriaID:  props.route.params?.categoriaID});
                }
            } catch (error) {
                Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao confirmar. Contate o suporte');
                console.log(error)
            }

            setLoadingSubmit(false);
        }
    }

    const handleDeleteImage = (urlImg) => {
        const deleteRegister = async() => {
            try {
                if (props.route.params?.servicoID !== null && props.route.params?.servicoID !== '' && props.route.params?.servicoID !== undefined) {
                    await deleteImagemServico(props.route.params?.servicoID, urlImg);
                    getDataImages();
                } else {
                    let newArrayImages = [];
                    images.map((e) => {
                        if (urlImg !== e.urlImg) {
                            newArrayImages.push({Img_Url: e.Img_Url, base64: e.base64, type: e.type, urlImg: e.urlImg})
                        }
                    })
                    setImages(newArrayImages);
                }
            } catch (error) {
                Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao excluir a imagem. Contate o suporte');
            }
        }

        Alert.alert('Confirmação', 'Deseja realmente excluir ?',
		[
			{text: 'Não', style: 'cancel'},
			{text: 'Sim', onPress: () => deleteRegister()},
		],
		{ cancelable: true });
    }

    const handleDeleteServico = () => {
        const deleteRegister = async() => {
            try {
                await deleteBarbeariaServico(props.route.params?.servicoID);
                Alert.alert('Atenção', 'Serviço excluído com sucesso');
                props.navigation.navigate('Servicos', { categoriaID:  props.route.params?.categoriaID});
            } catch (error) {
                if (error.message === "Request failed with status code 401") {
                    Alert.alert('Atenção', 'Não foi possível excluir o serviço pois há agendamentos que ainda irão ocorrer com este serviço');
                }
            }
        }

        Alert.alert('Confirmação', 'Deseja realmente excluir ?',
		[
			{text: 'Não', style: 'cancel'},
			{text: 'Sim', onPress: () => deleteRegister()},
		],
		{ cancelable: true });
    }

    const RenderItem = ({url, urlImg}) => {
        return (
            <View key={url} style={style.itemImage}>
                <Image style={style.image} source={{ uri: url  }}/>
                <TouchableOpacity style={{alignItems: 'center', marginTop: 10, justifyContent: "center"}} onPress={() => handleDeleteImage(urlImg)}>
                    <MAIcon name="delete-circle-outline" size={35} color={'#71150D'}></MAIcon>
                    <Text style={[style.text, {color: '#000'}]}>Excluir</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (loading) {
        return <Loading/>
    } else {
    return (
        <ScrollView style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.container}>
                {!loadingImage?
                <FlatList
                    data={images}
                    horizontal={true}
                    renderItem={({item}) => <RenderItem url={item.Img_Url} urlImg={item.urlImg}/>}
                    keyExtractor={item => item.Img_Url}
                />:<ActivityIndicator/>}
                <TouchableOpacity style={[style.buttonPickImage, { marginTop: 30 }]} onPress={pickImage}>
                    <MIcon
                    name="photo-library" 
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
                activeOutlineColor='#FFCA9F'
                label="Nome"
                error={errors.nome !== null ? true : false}
                onFocus={() => handleError(null, 'nome')}
                theme={{ colors: { placeholder: `${state.nome!==null&&state.nome!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                left={<TextInput.Icon color="#FFCA9F" name="content-cut" />}
                value={state.nome}
                onChangeText={(nome) => setValueState('nome', nome)}
                />
                <HelperText type="error" visible={errors.nome !== null ? true : false}>
                    {errors.nome}
                </HelperText>
                <TextInput
                style={style.input}
                mode='flat'
                activeOutlineColor='#FFCA9F'
                label="Valor"
                keyboardType="decimal-pad"
                error={errors.valor !== null ? true : false}
                onFocus={() => handleError(null, 'valor')}
                theme={{ colors: { placeholder: `${state.valor!==null&&state.valor!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                left={<TextInput.Icon color="#FFCA9F" name="currency-brl" />}
                value={state.valor}
                onChangeText={(valor) => setValueState('valor', valor)}
                />
                <HelperText type="error" visible={errors.valor !== null ? true : false}>
                    {errors.valor}
                </HelperText>
                <TextInput
                style={style.input}
                mode='flat'
                activeOutlineColor='#FFCA9F'
                label="Duração"
                editable={false}
                keyboardType="decimal-pad"
                error={errors.duracao !== null ? true : false}
                onFocus={() => handleError(null, 'duracao')}
                theme={{ colors: { placeholder: `${state.duracao!==null&&state.duracao!==''?"#FFCA9F":"#FFCA9F"}`, text: '#FFCA9F', primary: '#FFCA9F' } }}
                left={<TextInput.Icon color="#FFCA9F" name="clock-outline" />}
                value={state.duracao}
                onChangeText={(duracao) => setValueState('duracao', duracao)}
                />
                <HelperText type="error" visible={errors.duracao !== null ? true : false}>
                    {errors.duracao}
                </HelperText>
                <View style={{flexDirection: "row", marginTop: 10}}>
                    <View>
                        <TouchableOpacity style={style.buttonMinusAdd} onPress={() => setValueState('duracao', (parseInt(state.duracao) - 15).toString())}>
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
                        <TouchableOpacity style={style.buttonMinusAdd} onPress={() => setValueState('duracao', (parseInt(state.duracao) + 15).toString())}>
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
                {(props.route.params?.servicoID !== null && props.route.params?.servicoID !== '' && props.route.params?.servicoID !== undefined)?
                <View style={style.viewSubmit}>
                    <TouchableOpacity activeOpacity={loadingSubmit ? 1 : 0.7} style={style.button} onPress={() => {!loadingSubmit?handleSubmit():null}}>
                        {loadingSubmit?<ActivityIndicator/>:<Text style={style.text}>CONFIRMAR</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 25, marginBottom: 50, alignItems: "center", justifyContent: "center"}} onPress={() => handleDeleteServico()}>
                        <MAIcon name="delete-circle-outline" size={50} color={'#71150D'}></MAIcon>
                    </TouchableOpacity>
                </View>
                :
                <TouchableOpacity 
                activeOpacity={loadingSubmit ? 1 : 0.7} 
                style={[style.button, {marginTop: 100, marginBottom: 50}]} 
                onPress={() => {!loadingSubmit?handleSubmit():null}}>
                {loadingSubmit?
                <ActivityIndicator/>
                :<Text style={[ style.text, { color: "#fff" }]}>Confirmar</Text>}
                </TouchableOpacity>}
            </View>
        </ScrollView>
    )}
}

export default DadosServico;