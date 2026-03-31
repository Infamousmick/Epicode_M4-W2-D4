// · Sei incaricato di creare un marketplace di libri online.

// · Usa tutti i nuovi tools e features che hai imparato per creare un'applicazione con i
// seguenti requisiti:
// o Una homepage che mostri tutti i libri con delle card di bootstrap
// Le card dovrebbero avere un pulsante per aggiungere al carrello e uno per
// "saltare" un prodotto
// o Una sezione per il carrello
// o Un input di testo per cercare i libri

// · Per raggiungere questo risultato, segui queste istruzioni:

// · Usa questo API per ottenere la lista di libri:
// https://striveschool-api.herokuapp.com/books

// Renderizza tutti i libri usando i template literals e .forEach o .map

// · Assicurati che dentro ad ogni card ci sia un pulsante "Aggiungi al carrello"

// · Quando il pulsante viene cliccato ...
// Aggiungi il libro alla lista del carrello
// Cambia lo stile della card per mostrare che è gia stata aggiunta (un bordo
// colorato o un badge vanno bene)

// 1. Aggiungi il libro alla lista del carrello
// 2. Cambia lo stile della card per mostrare che è gia stata aggiunta (un bordo
// colorato o un badge vanno bene)

// · Aggiungi un input di testo che funzioni come una barra di ricerca. Quando l'utente scrive
// più di 3 caratteri, filtra il risultato dell'API per renderizzare solo i libri con un titolo che
// corrisponda, anche parzialmente, al contenuto dell'input. SUGGERIMENTO: usa .filter()

// · EXTRA FACOLTATIVI:

// . Dai la possibilità all'utente di cancellare libri dal loro carrello

// · Conta gli elementi nel carrello e mostra il risultato nella sezione carrello

// . Crea un pulsante per svuotare il carrello

// ########## M4 W3 D1 ########## //
// · Aggiungi un pulsante "salta" su tutte le card. Al click, dovrebbe far scomparire la card.

// · Crea una pagina "dettagli". Cliccando su un terzo pulsante sulla card, l'utente deve
// essere portato ad una pagina html separata dove visualizzerai i dettagli del libro.
// Per farlo, usa gli URLSearchParams in questo modo:
// Il link alla pagina dettagli dovrebbe avere una struttura simile:
// /dettagli.html?id=1940026091
// Dove 1940026091 è l'asin del libro su cui l'utente ha cliccato
// La parte evidenziata si chiama "search param".
// Nella pagina dettagli, puoi recuperare l'asin usando
// const params = new URLSearchParams (location.search)
// const id = params.get ("id")
// Esegui quindi la fetch usando l'id:
// https://striveschool-api.herokuapp.com/books/INSERISCI ASIN QUI

let allBooks = [];
let cart = [];

const getBooks = async (url) => {
  showLoading(true);

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.warn(err);
  } finally {
    showLoading(false);
  }
};

const showLoading = (state) => {
  if (state) {
    document.querySelector(".loading-container").classList.remove("d-none");
  } else {
    document.querySelector(".loading-container").classList.add("d-none");
  }
};

const init = async () => {
  let url = "https://striveschool-api.herokuapp.com/books";
  allBooks = await getBooks(url);
  const books = formatBooksData(allBooks);
  createBookCards(books);
};

init();

const input = document.querySelector(".searchContainer .inputBox");
input.addEventListener("input", () => {
  checkInputLength(input.value.trim(), 3);
});

const checkInputLength = (searchInput, num) => {
  if (searchInput.length >= num) {
    const filteredData = filterData(allBooks, searchInput);
    createBookCards(formatBooksData(filteredData));
  } else {
    const books = formatBooksData(allBooks);
    createBookCards(books);
  }
};

const filterData = (data, searchInput) => {
  return data.filter((book) => {
    return book.title.toLowerCase().includes(searchInput.toLowerCase());
  });
};

const formatBooksData = (arrBooks) => {
  return arrBooks
    .map((book) => {
      const { asin, img, price, title } = book;
      return `
        <div class="col">
          <div class="card h-100">
            <img src="${img}" class="object-fit-cover rounded-2" style="height: 200px" alt="Book Image"/>
             <div class="card-body d-flex flex-column">
              <h5 class="card-title">${title}</h5>
              <p class="card-text price">${price}€</p>
                <div class="d-flex flex-column gap-2 mt-auto">          
                  <a href="#" class="btn btn-primary add-to-cart" onclick="addToCart(this)" data-asin="${asin}"><i class="fa-solid fa-cart-shopping"></i><span class="btn-text">Add to cart</span></a>
                  <a href="#" class="btn btn-danger hide" onclick="hideBook(this)"><i class="fa-regular fa-circle-xmark"></i><span class="btn-text">Hide</span></a>
                  <a href="/details.html?id=${asin}" class="btn btn-light showInfo" onclick="hideBook(this)"><i class="fa-solid fa-circle-info"></i><span class="btn-text">Show info</span></a>
                </div>
              </div>
            </div>
          </div>`;
    })
    .join("\n");
};

const createBookCards = (books) => {
  const container = document.querySelector("section#books .booksContainer");
  container.innerHTML = books;
};

const addToCart = (btn) => {
  const clickedBtn = btn.closest(".add-to-cart");
  clickedBtn.classList.add("btn-success");
  clickedBtn.classList.remove("btn-primary");

  const bookAsin = clickedBtn.dataset.asin;
  cart.push(allBooks.find((book) => book.asin.includes(bookAsin)));

  const card = btn.closest(".card");
  card.classList.add("class", "checked");

  clickedBtn.querySelector("i").classList.remove("fa-cart-shopping");
  clickedBtn.querySelector("i").classList.add("fa-check");

  clickedBtn.lastChild.innerHTML = "Added";

  injectBooksModal();
};

const hideBook = (btn) => {
  btn.preventDefault;
  const col = btn.closest(".col");
  col.setAttribute("class", "remove");
  col.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  col.style.opacity = "0";
  col.style.transform = "scale(0.9)";
  setTimeout(() => col.remove(), 300);
};

const injectBooksModal = () => {
  const modal = document.querySelector("#booksModal .modal-body");
  const clearBtn = document.querySelector(".clearCart");

  if (cart.length === 0) {
    modal.innerHTML = "Carrello vuoto";
    printTotalCart("");
    clearBtn.classList.add("d-none");
  } else {
    let li = "";
    let totalPrice = 0;

    const newItem = cart.reduce((acc, item, index) => {
      const { asin, title, price } = item;
      totalPrice += price;
      acc += `
    <li class="list-group-item">
      <div class="d-flex justify-content-between alig-items-center">
        <h5 class="mb-0">${title}</h5>
        <p class="mb-0">${price}€</p>
      </div>
      <a class="btn btn-danger remove" onclick="removeItemCart('${asin}', ${index})" data-asin=${asin}><i class="fa-regular fa-circle-xmark"></i>Remove</a>
    </li>
`;
      return acc;
    }, "");
    modal.innerHTML = `<ul class="list-group">${newItem}</ul>`;
    clearBtn.classList.remove("d-none");
    printTotalCart(`${totalPrice.toFixed(2)}€ per ${cart.length} libri`);
  }
};

const printTotalCart = (text) => {
  document.querySelector(".resultCart").innerText = text;
};

const removeItemCart = (asin, index) => {
  const cardItem = document
    .querySelector(
      `section#books .booksContainer .add-to-cart[data-asin='${asin}']`,
    )
    .closest(".card");
  cardItem.classList.remove("checked");

  const btnItem = document
    .querySelector(
      `section#books .booksContainer .add-to-cart[data-asin='${asin}']`,
    )
    .closest(".add-to-cart");

  btnItem.classList.remove("btn-success");
  btnItem.classList.add("btn-primary");

  btnItem.children[0].classList.remove("fa-check");
  btnItem.children[0].classList.add("fa-cart-shopping");

  btnItem.lastChild.innerHTML = "Add to cart";

  cart.splice(index, 1);
  injectBooksModal();
};

const clearCart = () => {
  cart = [];
  injectBooksModal();
};
