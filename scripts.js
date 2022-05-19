//altera o comando doc.sq() para um atalho mais curto.
const doc = document.querySelector.bind(document);

    //cria um objeto que recebe informações do DOM de forma generalizada.
    const html={
        links: [...doc('.stepBar').children],
        content: [...doc('.formArea').children],
        final: doc('.final'),
        openStep: doc("[data-open]"),//pega a 1 página para manter aberta.
        btn: [...doc('.btn').children],
        btns: [...doc('.btns').children]
    }

    //valida o CPF difitado
    function validateCPF(){
        const cpf = doc('#cpf').value
        let regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
        try{
            if(!regex.test(cpf) || cpf === '')
                throw new Error()
        }catch(Error){
            alert("CPF inválido, digite novamente")
            return;
        }
        validateDate()
    }

    //valida a data de nascimento
    function validateDate(){
        const dtNasc = doc('#dtNasc').value
        if(dtNasc == ''){
            alert('Insira a data de nascimento')
            return
        }
        showCurrentStep('adress')
        show()
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
    }

    //recebe um evento para pegar o id onde está ocorrendo
    function selectStep(event){
        removeAllActiveStep()

        const select = event.currentTarget
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
        html.final.innerHTML += `<p><br>Nome: ${name}<\p><br>
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