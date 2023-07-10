import createContext from "./createContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { api, createSession, getUsuario } from "../services/api";

const initialState = {};

const reducer = (state, action) => {
    switch (action.type) {
        default:
        return state;
    }
};

const login = (dispatch) => {
    return async (email, senha) => {
        try {           
            const response = await createSession(email, senha);

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