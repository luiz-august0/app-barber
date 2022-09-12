import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:5000'
});

//Rota de sessão
export const createSession = async (usuario, senha) => {
    return api.put('/sessions', { usuario, senha });
};
/**************************************************************/

//Rota de usuários
export const getUsuarios = async () => { 
    return api.get('/usuario');
};

export const createUsuario = async (usuario, senha, setor) => {
    return api.post('/usuario', { usuario, senha, setor});
};

export const updateUsuario = async (usuario, senha, setor, usuarioID) => {
    return api.put(`/usuario/${usuarioID}`, { usuario, senha, setor });
};

export const deleteUsuario = async (usuarioID) => {
    return api.delete(`/usuario/${usuarioID}`);
};