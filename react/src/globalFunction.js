class GFunctions {
    formataCampo(campo, Mascara) { 
        if (campo === null) {
            return "";
        }

        var boleanoMascara; 
    
        var exp = /\-|\.|\/|\(|\)| /g
        var campoSoNumeros = campo.toString().replace( exp, "" ); 
    
        var i = 0;
        var posicaoCampo = 0;    
        var NovoValorCampo ="";
        var TamanhoMascara = campoSoNumeros.length;; 
    
        for(i=0; i<= TamanhoMascara; i++) { 
            boleanoMascara = ((Mascara.charAt(i) == "-") || (Mascara.charAt(i) == ".")
                                                        || (Mascara.charAt(i) == "/")) 
            boleanoMascara = boleanoMascara || ((Mascara.charAt(i) == "(") 
                                                        || (Mascara.charAt(i) == ")") || (Mascara.charAt(i) == " ")) 
            if (boleanoMascara) { 
                NovoValorCampo += Mascara.charAt(i); 
                TamanhoMascara++;
            }else { 
                NovoValorCampo += campoSoNumeros.charAt(posicaoCampo); 
                posicaoCampo++; 
            }          
        }      
        return NovoValorCampo;
    }

    formataCPF = (value) => {
        if (value === null) {
            return "";
        }

        return value.replace(/^(\d{3})\D*(\d{3})\D*(\d{3})\D*(\d{2})$/g,'$1.$2.$3-$4');
    }

    minsToHHMMSS = (value) => {
        var mins_num = parseFloat(value, 10);
        var hours   = Math.floor(mins_num / 60);
        var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
        var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));
    
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }

    commaPerPoint = (value) => {
        if (value !== '' && value !== null && value !== undefined) {
            return value.replace(',', '.');
        } else {
            return '';
        }
    }

    PointPerComma = (value) => {
        if (value !== '' && value !== null && value !== undefined) {
            return value.replace('.', ',');
        } else {
            return '';
        }
    }

    validaSenha = (value) => {
        let letrasMaiusculas = /[A-Z]/;
        let letrasMinusculas = /[a-z]/; 
        let numeros = /[0-9]/;
        let caracteresEspeciais = /[!|@|#|$|%|^|&|*|(|)|-|_]/;

        if(!letrasMaiusculas.test(value)){
            return {
                erro: true,
                mensagem: 'A senha deve conter pelo menos uma letra maiúscula'
            }
        }

        if(!letrasMinusculas.test(value)){
            return {
                erro: true,
                mensagem: 'A senha deve conter pelo menos uma letra minúscula'
            }
        }

        if(!numeros.test(value)){
            return {
                erro: true,
                mensagem: 'A senha deve conter pelo menos um número'
            }
        }

        if(!caracteresEspeciais.test(value)){
            return {
                erro: true,
                mensagem: 'A senha deve conter pelo menos um caractere especial, como !, @, #, $, %, ^, &, *, (, ), -, ou _'
            }
        }

        return {
            erro: false,
            mensagem: ''
        }
    }
}

export default new GFunctions();