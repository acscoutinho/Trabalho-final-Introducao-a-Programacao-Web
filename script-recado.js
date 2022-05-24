'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active');

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
};

/* const tempRecado = {

    descreverRecado: 'cavar',
    detalharRecado: 'lavar roupas',
}; */

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_recado')) ?? [];
const setLocalStorage = (dbRecado) => localStorage.setItem("db_recado", JSON.stringify(dbRecado));

//CRUD - CREATE RE
const deleteRecado = (index) => {
    const dbRecado = readRecado();
    dbRecado.splice(index, 1);
    setLocalStorage(dbRecado);
};

const updateRecado = (index, recado) => {
    const dbRecado = readRecado();
    dbRecado[index] = recado;
    setLocalStorage(dbRecado);
};

const readRecado = () => getLocalStorage();

const createRecado = (recado) => {
    const dbRecado = getLocalStorage()
    dbRecado.push (recado)
    setLocalStorage(dbRecado)
    
};

const isValidFields = () => {
  return document.getElementById('form').reportValidity();
}

//interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
    document.getElementById('descricao').dataset.index = 'new'
}

const salveRecado = () => {
    if (isValidFields()) {
        const recado = {
            descricao: document.getElementById('descricao').value,
            detalhar: document.getElementById('detalhar').value,
        }
        const index = document.getElementById('descricao').dataset.index;

        if(index == 'new'){
            createRecado(recado);
            updateTable();
            closeModal();
        } else {
            updateRecado(index, recado);
            updateTable();
            closeModal();
        }

    }
};

const createRow = (recado, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${recado.descricao}</td>
        <td>${recado.detalhar}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableRecado>tbody').appendChild(newRow);    
};

const clearTable = () =>{
    const rows = document.querySelectorAll('#tableRecado>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));

};

const updateTable = () => {
    const dbRecado = readRecado()
    clearTable()
    dbRecado.forEach(createRow)
};

const fillFields = (recado) => {
    document.getElementById('descricao').value = recado.descricao 
    document.getElementById('detalhar').value = recado.detalhar 
    document.getElementById('descricao').dataset.index = recado.index 
}; 

const  editeRecado = (index) => {
    const recado = readRecado()[index];
    recado.index = index;
    fillFields(recado);
    openModal();

};


const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-');

        if (action == 'edit') {
            editeRecado(index);
        } else {
            const recado = readRecado()[index];
            const response = confirm (`Deseja realmente excluir o ${recado.descricao} `);
            if (response){
                deleteRecado(index);
                updateTable();
            };
        };

    };

};

updateTable()

//eventos
document.getElementById('cadastrarRecado')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('salvar')
    .addEventListener('click', salveRecado);

document.querySelector('#tableRecado>tbody')
    .addEventListener('click', editDelete);

document.getElementById('cancelar')
    .addEventListener('click', closeModal);