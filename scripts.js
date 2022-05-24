//altera o comando doc.sq() para um atalho mais curto.
const doc = document.querySelector.bind(document);

    //cria um objeto que recebe informações do DOM de forma generalizada.
    const html={
        links: [...doc('.stepBar').children],
        content: [...doc('.formArea').children],
        final: doc('.final'),
        openStep: doc("[data-open]"),//pega a primeira página para manter aberta.
        btn: [...doc('.btn').children],
        btns: [...doc('.btns').children]
    }

    //valida o CPF
    function isCPF() {	
        cpf = doc('#cpf').value
        cpf = cpf.replace(/[^\d]+/g,'');
        if(cpf == '') return false;	
        // Elimina CPFs invalidos conhecidos	
        if (cpf.length != 11 || 
            cpf == "00000000000" || 
            cpf == "11111111111" || 
            cpf == "22222222222" || 
            cpf == "33333333333" || 
            cpf == "44444444444" || 
            cpf == "55555555555" || 
            cpf == "66666666666" || 
            cpf == "77777777777" || 
            cpf == "88888888888" || 
            cpf == "99999999999")
                return false;		
        // Valida 1o digito	
        count = 0;	
        for (i=0; i < 9; i ++)		
            count += parseInt(cpf.charAt(i)) * (10 - i);	
            dig = 11 - (count % 11);	
            if (dig == 10 || dig == 11)		
                dig = 0;	
            if (dig != parseInt(cpf.charAt(9)))		
                return false;		
        // Valida 2o digito	
        count = 0;	
        for (i = 0; i < 10; i ++)		
            count += parseInt(cpf.charAt(i)) * (11 - i);	
        dig = 11 - (count % 11);	
        if (dig == 10 || dig == 11)	
            dig = 0;	
        if (dig != parseInt(cpf.charAt(10)))
            return false;		
        return true;   
    }


    //valida a data de nascimento
    function validateDate(){
        const dtNasc = doc('#dtNasc').value
        if(dtNasc == ''){
            alert('Insira a data de nascimento')
        }
    }

    //esconde todas as abas
    function hideAllStepContent(){
        html.content.forEach(step => {
            step.style.display = "none"
        })

    }
    
    //apaga a rolagem das barras que estão ativas
    function removeAllActiveStep(){
        html.links.forEach(step => {
            step.className =  step.className.replace("active" , "");
        })
    }
    
    //mostra a aba atual com base no id recebido
    function showCurrentStep(id){
        hideAllStepContent()

        const stepContent = doc('#'+id)
        stepContent.style.display = "block";
        
        //ativa a rolagem na barra atual
        id.className +="active";
    
        if(id == 'adress'){
            validateDate()
            isCPF() ? html.final.innerHTML += `CPF: ${doc('#cpf').value}` : alert('CPF inválido')
        }
        if(id == 'final'){
            consultCEP()
            show()
        }
    }

    //recebe um evento para pegar o id onde está ocorrendo
    function selectStep(event){
        removeAllActiveStep()

        const select = event.target
        showCurrentStep(select.dataset.id)
        
        //ativa apenas a aba atual
        select.className += "active";
    }
    
    //aguarda um evento para mudança de página.
    function listenForChanges(){
        html.links.forEach(step =>{
            step.addEventListener('click', selectStep)
        })

        html.btns.forEach(click =>{
            click.addEventListener('click', selectStep)
        })
    }

    //função que vai buscar o CEP digitado em input na API.
    function consultCEP(){
        const cep = doc("#cep").value;
        //valida o cep
        if(cep.length != 8 || cep === ""){
            alert('CEP inválido')
            return;
        }else

        //pega o json recebido pela API viacep e altera os valores do input
        var url = "https://viacep.com.br/ws/"+ cep+"/json/";
        $.getJSON(url, function(data){
            $("#rua").val(data.logradouro);
            $("#bairro").val(data.bairro);
            $("#city").val(data.localidade);

            //converte o JSON para objeto
            fetch(url).then(function(response){
                response.json().then(function(data){
                    showResult(data);
                })
            })
        })
    }

    //mostra o resultado dos dados inseridos na primeira aba.
    function show(){
        let name = doc('#nome').value
        let dtNasc = doc('#dtNasc').value
        let cpf = doc('#cpf').value
        html.final.innerHTML = `<p><br>Nome: ${name}<\p><br>
                                <p>Data de Nascimento: ${dtNasc}<\P><br>
                                <p>CPF: ${cpf}<\P><br>`
    }
    //mostra o resultado com base no objeto JSON da API.
    function showResult(data){
        html.final.innerHTML += `<br><p>${data.logradouro}<\p><br>
                                <p>Bairro: ${data.bairro}<\p><br>
                                <p>Cidade: ${data.localidade}<\p>`
    }
    
    //reune todos as funções para startar o código.
    function start(){
        hideAllStepContent()
        listenForChanges()
        //clica na primeira aba para manter aberta enquanto nenhum evento ocorrer.
        html.openStep.click()
    }


start()



