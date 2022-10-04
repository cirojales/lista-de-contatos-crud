const URL_API = "http://localhost:8000";

async function listarContatos() {
  let res = await fetch(`${URL_API}/contatos`);
  let contatos = await res.json();
  let stringContatos = "";

  contatos.forEach((contato) => {
    stringContatos += `
    <tr>
    <td><input type="checkbox" data-tipo="checkbox" value="${contato.id}"></td>
    <td class="col-4">${contato.nome}</td>
    <td class="col-4">${contato.telefone}</td>
    <td class="col-4">${contato.cidade}</td>
    <td td class="col-0">
    <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasEditar"><button onclick="buscarParaEditar(${contato.id})" type="button" class="btnEditar d-inline-flex btn btn-warning btn-sm px-2 m-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar contato">
    <span class="material-icons">edit</span>
    </button></span>
    </td>
    </tr>
    `;
  });

  // <button onclick="excluirContato(${contato.id})" type="button" class="btnExcluir d-inline-flex btn btn-danger btn-sm px-2 m-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Excluir contato">
  //   <span class="material-icons">delete</span>
  //   </button>

  listaDeContatos.innerHTML = stringContatos;

  let tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  let checkboxes = Array.from(
    document.querySelectorAll(`input[data-tipo=checkbox]`)
  );
  checkboxes.forEach((el) =>
    el.addEventListener("click", () => {
      if (checkboxes.every((el) => el.checked)) {
        marcadorTodos.checked = true;
      } else {
        marcadorTodos.checked = false;
      }
    })
  );
}

listarContatos()

function filtrarContatos() {
  let busca = inputBuscar.value;
  let linhas = Array.from(listaDeContatos.getElementsByTagName("tr"));

  for (let elemento of linhas) {
    let colunaNomes = elemento.children[1].innerText;
    let colunaTelefones = elemento.children[2].innerText;
    let colunaCidades = elemento.children[3].innerText;
    let colunas = colunaNomes + colunaTelefones + colunaCidades;

    if (new RegExp(busca, "i").test(colunas)) {
      elemento.style.display = "";
    } else {
      elemento.style.display = "none";
    }
  }
}

async function buscarParaEditar(id) {
  let res = await fetch(`${URL_API}/contatos/${id}`);
  let contatos = await res.json();

  inputEditarNome.value = contatos.nome;
  inputEditarTelefone.value = contatos.telefone;
  inputEditarCidade.value = contatos.cidade;
  inputEditarID.value = contatos.id;
}

async function editarContato() {
  event.preventDefault();

  let dados = {
    nome: inputEditarNome.value,
    telefone: inputEditarTelefone.value,
    cidade: inputEditarCidade.value,
    id: inputEditarID.value,
  };

  await fetch(`${URL_API}/contatos/${inputEditarID.value}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
    headers: {
      "content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(() => listarContatos());


  let x = document.querySelector('[data-bs-dismiss="offcanvas"]');

  x.dispatchEvent(new Event("click"));
}


async function excluirContato(id) {
  if (!confirm("Você confirma a exclusão do contato?")) {
    return;
  }

  let res = await fetch(`${URL_API}/contatos/${id}`, {
    method: "DELETE",
  });

  listarContatos();
}

async function adicionarContato() {
  event.preventDefault();

  let dados = {
    nome: inputNome.value,
    telefone: inputTelefone.value,
    cidade: inputCidade.value,
  };
  console.log(dados);

  let res = await fetch(`${URL_API}/contatos`, {
    method: "POST",
    body: JSON.stringify(dados),
    headers: {
      "Content-Type": "application/json",
    },
  });

  listarContatos();

  let fechar = document.querySelector('[data-bs-dismiss="modal"]');

  fechar.dispatchEvent(new Event("click"));

  formAdicionar.reset();
}

function formatarTelefone(event) {
  let input = event.target;
  input.value = mascaraDeTelefone(input.value);
}

function mascaraDeTelefone(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

function marcarDesmarcarTodos() {
  let todos = document.querySelectorAll('[data-tipo=checkbox]');

  todos.forEach((cadaCheck) => {
    cadaCheck.checked = marcadorTodos.checked;

  })
}

function acionarBotaoExcluir() {
  
}


listarContatos()


function excluirSelecionados() {
  let marcados = Array.from(
    document.querySelectorAll(`input[data-tipo=checkbox]:checked`)
  );

  let mensagem = "";
  if (marcados.length > 1) {
    mensagem = `${marcados.length} contatos serão excluídos. Deseja prosseguir?`;
  } else if (marcados.length === 1) {
    mensagem = `O contato será excluído. Deseja prosseguir?`;
  }

  if (!marcados.length) {
    alert("Você deve selecionar pelo menos um contato.");
    return;
  }

  if (!confirm(`${mensagem}`)) {
    return;
  }

  marcados.forEach(async marcado => {
    let res = await fetch(`${URL_API}/contatos/${marcado.value}`, {
      method: "DELETE",
    });
    listarContatos();
  });
}