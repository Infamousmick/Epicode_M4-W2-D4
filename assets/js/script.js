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

let allBooks = [];
let cart = [];

const getBooks = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.warn(err);
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
              <p class="card-text">${price}</p>
                <div class="d-flex flex-column gap-2 mt-auto">          
                  <a href="#" class="btn btn-primary add-to-cart" data-asin="${asin}"><i class="fa-solid fa-cart-shopping"></i>Add to cart</a>
                  <a href="#" class="btn btn-danger hide"><i class="fa-regular fa-circle-xmark"></i>Hide</a>
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
  assignBtnCarts();
  assignBtnRemove();
};

const assignBtnCarts = () => {
  addToCartBtn = document.querySelectorAll("section#books .add-to-cart");
  addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const clickedBtn = e.target.closest(".add-to-cart");
      clickedBtn.classList.add("btn-success");
      clickedBtn.classList.remove("btn-primary");

      const bookAsin = clickedBtn.dataset.asin;
      cart.push(allBooks.find((book) => book.asin.includes(bookAsin)));

      const card = e.target.closest(".card");
      card.classList.add("class", "checked");

      clickedBtn.querySelector("i").classList.remove("fa-cart-shopping");
      clickedBtn.querySelector("i").classList.add("fa-check");
      injectBooksModal();
    });
  });
};

const assignBtnRemove = () => {
  btnRemove = document.querySelectorAll("section#books .hide");
  btnRemove.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      card.remove();
    });
  });
};

const injectBooksModal = () => {
  const modal = document.querySelector("#booksModal .modal-body");
  let li = "";
  cart.forEach((item) => {
    const { asin, title, price } = item;
    li += `
    <li class="list-group-item">
      <h5>${title}
      </h5>
      <p>${price}</p>
      <a class="btn btn-danger remove" data-asin=${asin}><i class="fa-regular fa-circle-xmark"></i>Remove</a>
    </li>
`;
  });
  modal.innerHTML = `<ul class="list-group">${li}</ul>`;
};
