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
}

export default new GFunctions();