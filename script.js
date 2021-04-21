'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelector('.show-modal');
const form = document.getElementById('form');
const toppingsContainer = document.querySelector('.toppings-container');
const addToppingBtn = document.getElementById('add-topping');
const messageContainer = document.querySelector('.message-container');
const message = document.getElementById('message');
const photoRadios = document.getElementsByName('photo');
const menuEl = document.querySelector('.menu-container');
const sortBy = document.querySelector('#sort-by');

//  FUNCTIONS

function initForm() {
  form.name.value = '';
  form.price.value = '';
  form.heat.value = 0;
  toppingsContainer.innerHTML = `<input
  type="text"
  class="topping"
  placeholder="Topping #1"
  required
/>
<input
  type="text"
  class="topping"
  placeholder="Topping #2"
  required
/>`;
  const toppingsInputs = document.querySelectorAll('.topping');
  toppingsInputs.forEach(input => (input.value = ''));
  photoRadios.forEach(input => (input.checked = false));
}

function storeFormData() {
  const toppingsInputs = document.querySelectorAll('.topping');
  let toppings = [];
  toppingsInputs.forEach(input => {
    if (input.value) {
      toppings.push(input.value);
    }
  });

  let checkedPhoto;
  photoRadios.forEach(e => {
    if (e.checked) {
      checkedPhoto = e.value;
    }
  });

  const pizza = {
    name: form.name.value,
    price: Number(form.price.value),
    heat: Number(form.heat.value),
    toppings: toppings,
    photo: checkedPhoto,
  };
  let menu = sessionStorage.getItem('menu');
  menu = menu ? JSON.parse(menu) : [];
  menu.push(pizza);
  sessionStorage.setItem('menu', JSON.stringify(menu));
  initForm();
  alert('Pizza addded to the menu!');
}

function processFormData(e) {
  e.preventDefault();
  storeFormData();
  updateMenu();
}

const sort = function (by, list) {
  return list.sort((a, b) => (a[by] > b[by] ? 1 : -1));
};

function updateMenu(menu = JSON.parse(sessionStorage.getItem('menu'))) {
  menuEl.innerHTML = '';
  if (menu) {
    menu.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.classList.add('menu-item');

      menuItem.innerHTML = `<img src="./img/pizza-${
        item.photo ? item.photo : 0
      }.png" />
      <div class="description">
        <h2>${item.name}<span>${
        item.heat === 3
          ? `<img src="./img/chilli.png" /><img src="./img/chilli.png" /><img src="./img/chilli.png" />`
          : item.heat === 2
          ? `<img src="./img/chilli.png" /><img src="./img/chilli.png" />`
          : item.heat === 1
          ? `<img src="./img/chilli.png" />`
          : ``
      }</span></h2>
        <p>Price: ${item.price}</p>
        <p>Toppings: ${item.toppings.join(', ')}</p>
      </div>`;

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '&times;';
      deleteBtn.classList.add('delete-item');
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Delete ${item.name}?`)) {
          const index = menu.indexOf(item);
          menu.splice(index, 1);
          sessionStorage.setItem('menu', JSON.stringify(menu));
          updateMenu();
        } else return;
      });
      menuItem.appendChild(deleteBtn);
      menuEl.appendChild(menuItem);
    });
  }
}

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

updateMenu(JSON.parse(sessionStorage.getItem('menu')));

// EVENT LISTENERS
form.addEventListener('submit', processFormData);

addToppingBtn.addEventListener('click', e => {
  e.preventDefault();
  let newToppingInput = document.createElement('input');
  newToppingInput.type = 'text';
  newToppingInput.classList.add('topping');
  newToppingInput.placeholder = `Topping #${
    toppingsContainer.childElementCount + 1
  }`;
  toppingsContainer.appendChild(newToppingInput);
});

btnsOpenModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

sortBy.addEventListener('change', e => {
  updateMenu(sort(e.target.value, JSON.parse(sessionStorage.getItem('menu'))));
});
