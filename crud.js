document.querySelector("#salvar").addEventListener("click", cadastrar)

let lista_conta = []

window.addEventListener("load", () => { 
    lista_conta = JSON.parse(localStorage.getItem("lista_conta")) || []
    atualizar()
  })
  
document.querySelector("#pendentes").addEventListener("click", () => {
  lista_conta = JSON.parse(localStorage.getItem("lista_conta")) || []
  lista_conta = lista_conta.filter(conta => !conta.paga)
  atualizar()
})
  
document.querySelector("#pagas").addEventListener("click", () => {
  lista_conta = JSON.parse(localStorage.getItem("lista_conta")) || []
  lista_conta = lista_conta.filter(conta => conta.paga)
  atualizar()
})

document.querySelector("#busca").addEventListener("keyup", () => filtrar())
document.querySelector("#buscar").addEventListener("click", () => filtrar())


function filtrar() {
  lista_conta = JSON.parse(localStorage.getItem("lista_conta")) || []
  nomeFiltro = document.querySelector("#nomeFiltro").textContent
  const busca = document.querySelector("#busca").value

  switch (nomeFiltro) {
    case 'Nome':
      lista_conta = lista_conta.filter(conta => conta.nome.includes(busca))
      break;
    case 'Endereço':
      lista_conta = lista_conta.filter(conta => conta.endereco.includes(busca))
      break;
    default:
      lista_conta = lista_conta.filter(conta => conta.data > busca)
  }

  atualizar()
}

document.querySelector("#filtroNome").addEventListener("click", () => {
  filtrarPor("o nome", document.querySelector("#filtroNome").textContent)
})


function filtrarPor(filtro, nomeFiltro) {
  document.querySelector("#nomeFiltro").textContent = nomeFiltro
  busca = document.querySelector("#busca")
  busca.setAttribute("placeholder", `Digite ${filtro}...`)
  busca.setAttribute("type", "search")
  busca.removeAttribute("disabled")
  document.querySelector('#buscar').removeAttribute("disabled")
}



function cadastrar() {
    const modal = bootstrap.Modal.getInstance(document.querySelector("#cadastrarConta"))
    let nome = document.querySelector("#nome").value
    let endereco = document.querySelector("#endereco").value
    let data = document.querySelector("#data").value
    let litros = document.querySelector("#consumo").value
    let tipoUsuario = document.querySelector("#tipoUsuario").value
    let preco = document.querySelector("#preco").value
    let observacoes = document.querySelector("#observacoes").value

    const conta = {
        id: Date.now(),
        nome: nome,
        endereco: endereco,
        data: data,
        litros: litros,
        tipoUsuario: tipoUsuario,
        preco: preco,
        observacoes: observacoes,
        paga: false
    }


    if (conta.nome.length == 0 || conta.endereco.length == 0 || conta.data == "" || conta.litros == "" || conta.preco == "") {
      if (conta.nome.length == 0) {
        document.querySelector("#nome").classList.add("is-invalid")
      }
      if (conta.endereco.length == 0) {
        document.querySelector("#endereco").classList.add("is-invalid")
      }
      if (conta.data == "") {
        document.querySelector("#data").classList.add("is-invalid")
      }
      if (conta.litros == "") {
        document.querySelector("#consumo").classList.add("is-invalid")
      }
      if (conta.preco == "") {
        document.querySelector("#preco").classList.add("is-invalid")
      }
      toastFunctionErr()
      return
  }
    
    document.querySelector("#button-cadastrar").setAttribute("data-bs-target", "#cadastrarConta")
    toastFunction()
    document.querySelector("#contas").innerHTML += gerarCard(conta)

    
    zerarInput(document.querySelector("#nome"))
    zerarInput(document.querySelector("#endereco"))
    zerarInput(document.querySelector("#data"))
    zerarInput(document.querySelector("#preco"))
    zerarInput(document.querySelector("#consumo"))

    lista_conta.push(conta)

    salvar()

    modal.hide()
  }
  
  
function zerarInput(atributo) {
  atributo.value = ""
  atributo.classList.remove("is-invalid")
}

function salvar() {
    localStorage.setItem("lista_conta", JSON.stringify(lista_conta))
}

function atualizar() {
  document.querySelector("#contas").innerHTML = ""
  lista_conta.forEach((conta) => {
    document.querySelector("#contas").innerHTML += gerarCard(conta)
  });
}


function apagar(id) {
  var x = document.getElementById("toast_del");
  x.className = "show";
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

  lista_conta = lista_conta.filter((x) => {
     return x.id != id
  })
  salvar()
  atualizar() 
}

function pagar(id) {
  var x = document.getElementById("toast_success");
  x.className = "show";
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

  let conta = lista_conta.find((x) => {
    return x.id == id
  })

  conta.paga = true
  salvar()
  atualizar()
}
function formatarPreco(input) {
  console.log(input)
  var valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  var formato = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor / 100); // Divide o valor por 100 para considerar os centavos

  input.value = formato;
}

function gerarCard(conta) {
  dataAntiga = conta.data

  var partes = dataAntiga.split('-');
  var ano = partes[0];
  var dia = partes[1];
  var mes = partes[2];

  dataNova = String(dia + '/' + mes + '/' + ano)

    return `<div class="col-lg-3 col-md-6 col-12">
    <div class="card">
      <div class="card-header">conta em nome de ${conta.nome}</div>
      <div class="card-body">
        <p class="card-text">Endereço: ${conta.endereco}</p>
        <p class="card-text">Data da conta: ${dataNova ? dataNova : "Sem data"}</p>
        <p class="card-text">Consumo de água: ${conta.litros} Litros</p>
        <p class="card-text">Preço R$${conta.preco}</span></p>
        <p class="card-text">Observações: ${conta.observacoes}</p>
        <p>
          <span class="badge text-bg-warning">${conta.tipoUsuario}</span>
        </p>
        <a onclick="pagar(${conta.id})" class="btn btn-success ${conta.paga ? "disabled" : ""}">
          <i class="bi bi-check-lg"></i>
        </a>
        <a onclick="apagar(${conta.id})" class="btn btn-danger">
          <i class="bi bi-trash"></i>
        </a>
      </div>
    </div>
  </div>`
}

document.querySelector('#btnSwitch').addEventListener('click',()=>{
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light')
        document.querySelector('#btnSwitch').innerHTML = '<i class="bi bi-moon-fill"></i>'

    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark')
        document.querySelector('#btnSwitch').innerHTML = '<i class="bi bi-brightness-high-fill"></i>'
    }
})

document.querySelector('#button-consumo').addEventListener('click', () => {
  var totalLitros = 0;
  var totalGasto = 0;
  lista_conta.forEach(conta => {
    totalLitros = parseInt(conta.litros) + parseInt(totalLitros)
    totalGasto = parseInt(conta.preco) + parseInt(totalGasto)
  })
  document.querySelector('#totalLitros').textContent = "Total de Litros: " + totalLitros
  document.querySelector('#totalGasto').textContent = "Total de gastos: R$ " + totalGasto
})

function toastFunction() {
  var x = document.getElementById("toast_add");
  x.className = "show";
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function toastFunctionErr() {
  var x = document.getElementById("toast_err");
  x.className = "show";
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function btnCheck() {
  console.log('check')
}

function btnTrash() {
  console.log('trash')
}