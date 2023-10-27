import createContext from "./createContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { api, createSession, getUsuario } from "../services/api";
import * as Sentry from "@sentry/react-native";
import * as Notifications from 'expo-notifications';
import { extra } from '../../app.config.js';

const initialState = {};

const registerForPushNotificationsAsync = async() => {
    let token;
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    token = (await Notifications.getExpoPushTokenAsync({ projectId: extra.eas.projectId })).data;
  
    return token;
}

const reducer = (state, action) => {
    switch (action.type) {
        default:
        return state;
    }
};

const login = (dispatch) => {
    let tokenNotificacao = "";

    return async (email, senha) => {
        try {           
            await registerForPushNotificationsAsync().then((res) => tokenNotificacao = res)

            const response = await createSession(email, senha, tokenNotificacao);

            const usuarioLogado = response.data.usuario;
            const token = response.data.token;

            await AsyncStorage.setItem("usuario", JSON.stringify(usuarioLogado));
            await AsyncStorage.setItem("token", token);

            api.defaults.headers.Authorization = `Bearer ${token}`;

            return {
                authenticated: true,
                token: token,
                dataUsuario: usuarioLogado
            }

        } catch (error) {
            if (error.message === "Request failed with status code 401") {
                Alert.alert('Atenção', 'Email ou senha inválido');
            } else {
                Sentry.captureException(error);
                Alert.alert('Atenção', 'Ops, ocorreu algum erro ao realizar o login, contate o suporte');
            }

            return {authenticated: false};
        }
    }
};

const logout = (dispatch) => {
    return async () => {
        await AsyncStorage.removeItem("usuario");
        await AsyncStorage.removeItem("token");
        
        api.defaults.headers.Authorization = null;
    }
};

const loadUser = (dispatch) => {
    return async () => {
        const usuario = await AsyncStorage.getItem("usuario");
        const token = await AsyncStorage.getItem("token");

        if (usuario && token) {
            try {        
                api.defaults.headers.Authorization = `Bearer ${token}`;
                
                const response = await getUsuario(JSON.parse(usuario).id);
                const data = response.data;    
            
                return {
                    authenticated: true,
                    token: token,
                    dataUsuario: {
                        id: data[0].Usr_Codigo,
                        email: data[0].Usr_Email,
                        nome: data[0].Usr_Nome,
                        contato: data[0].Usr_Contato,
                        cpf: data[0].Usr_CPF,
                        tipo: data[0].Usr_Tipo,
                        urlImagem: data[0].Usr_FotoPerfil
                    }
                }
            } catch (error) {
                console.log(error);
                return {authenticated: false}
            }

        } else {
            return {authenticated: false};
        }
    }
}

export const { Context, AuthProvider } = createContext(
    reducer,
    { login, logout, loadUser },
    initialState,
);