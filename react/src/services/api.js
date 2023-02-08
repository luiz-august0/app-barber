import axios from "axios";

export const api = axios.create({
    baseURL: 'https://api-barber.vercel.app'
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

export const verifyUsuario = async (email, cpf) => {
    return api.post('/usuarioVerify', { email, cpf })
};

export const createUsuario = async (email, nome, senha, contato, cpf, tipo) => {
    return api.post('/usuario', { email, nome, senha, contato, cpf, tipo });
};

export const updateUsuario = async (email, nome, contato, cpf, usuarioID) => {
    return api.put(`/usuario/${usuarioID}`, { email, nome, contato, cpf });
};

export const updateUsuarioPassword = async (senhaAntiga, senhaNova, usuarioID) => {
    return api.put(`/usuario_password/${usuarioID}`, { senhaAntiga, senhaNova });
};

export const deleteUsuario = async (usuarioID) => {
    return api.delete(`/usuario/${usuarioID}`);
};

export const getUsuario = async (usuarioID) => {
    return api.get(`/usuario/${usuarioID}`);
};