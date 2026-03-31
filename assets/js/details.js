const param = new URLSearchParams(window.location.search);

const id = param.get("id");

let url = "https://striveschool-api.herokuapp.com/books/";

const showLoading = (state) => {
  if (state) {
    document.querySelector(".loading-container").classList.remove("d-none");
  } else {
    document.querySelector(".loading-container").classList.add("d-none");
  }
};

const getBook = async () => {
  showLoading(true);
  try {
    const response = fetch(`${url}${id}`);
    return (await response).json();
  } catch (err) {
    console.log(err);
  } finally {
    showLoading(false);
  }
};

getBook()
  .then((data) => createCard(data))
  .then((card) => appendCard(card));

const createCard = ({ asin, title, price, img, category }) => {
  return `
          <article
        class="card shadow-lg border-0 rounded-4 overflow-hidden position-relative mx-auto"
        style="max-width: 900px"
      >
        <div class="row g-0">
          <div class="col-md-5 position-relative">
            <span
              class="position-absolute top-0 start-0 m-3 badge rounded-pill bg-primary fs-5 shadow-sm z-1"
              >${price}€</span
            >
            <img
              src="${img}"
              class="img-fluid w-100 h-100 object-fit-cover"
              alt="Copertina del libro: [${title}]"
              style="min-height: 350px"
            />
          </div>

          <div class="col-md-7">
            <div class="card-body p-5 d-flex flex-column h-100">
              <p
                class="text-uppercase text-muted fw-bold small mb-2 text-tracking-wide"
              >
                ${category}
              </p>

              <h2 class="card-title fw-bold text-dark mb-3">
                ${title}
              </h2>

              <p class="card-text text-secondary mb-4 fs-6 flex-grow-1">
               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>

              <div class="mt-auto pt-3">
                <button
                  class="btn btn-dark btn-lg rounded-pill w-100 px-4 shadow-sm text-uppercase fw-bold"
                >
                  Aggiungi al carrello
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>`;
};

const appendCard = (card) => {
  document.querySelector("#books").innerHTML = card;
};
