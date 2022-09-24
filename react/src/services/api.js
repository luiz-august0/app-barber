import axios from "axios";

export const api = axios.create({
    baseURL: 'http://192.168.0.105:5000'
});

//Rota de sessão
export const createSession = async (email, senha) => {
    return api.put('/sessions', { email, senha });
};
/**************************************************************/

//Rota de usuários
export const getUsuarios = async () => { 
    return api.get('/usuario');
};

export const createUsuario = async (email, nome, senha, contato, cpf, tipo) => {
    return api.post('/usuario', { email, nome, senha, contato, cpf, tipo });
};

export const updateUsuario = async (email, nome, senha, contato, cpf, usuarioID) => {
    return api.put(`/usuario/${usuarioID}`, { email, nome, senha, contato, cpf });
};

export const deleteUsuario = async (usuarioID) => {
    return api.delete(`/usuario/${usuarioID}`);
};

export const getUsuario = async (usuarioID) => {
    return api.get(`/usuario/${usuarioID}`);
};