import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './styles.css';

const ForgotPassword = (props) => {
    const { key } = useParams();
    const [senha, setSenha] = useState(""); 
    const [senhaConfirm, setSenhaConfirm] = useState(""); 
    
    const MySwal = withReactContent(Swal);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (senha.length < 6) {
            MySwal.fire({
            html: <i>Senha invalida, digite uma senha com no minímo 6 caracteres</i>,
            icon: 'warning'
            })
            return;
        } 
	  
		if (senha !== senhaConfirm) {
            MySwal.fire({
            html: <i>Senhas não coincidem, digite novamente</i>,
            icon: 'warning'
            })
            return;
        } 

        try {
			
		} catch (error) {
			
		}
    }

	useEffect(() =>{

    }, []);

	console.log(key)
      
    return (
        <div id="app">
            <h1 style={{color: '#fff', fontWeight: 'bold'}} >Recuperação de Senha</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="senha">Senha</label>
                    <input 
                        type="text" 
                        name="senha" 
                        id="senha"
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                    />
                </div>
                <div className="field">
                    <label htmlFor="senhaConfirm">Confirmar Senha</label>
                    <input 
                        type="text" 
                        name="senhaConfirm" 
                        id ="senhaConfirm"
                        value={senha}
                        onChange={(e) => setSenhaConfirm(e.target.value)}
                    />
                </div>
                <div className="actions">
                    <button type="submit">Recuperar Senha</button>                
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;