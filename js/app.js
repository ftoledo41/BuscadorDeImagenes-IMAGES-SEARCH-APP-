// IMAGE SEARCH APP

// https://pixabay.com/api/docs/

// Your API key: 46557407-0a0ddfd9efbd68fafe671b704

// 230. Solicitar datos a la API
doc = document;

const searchInput = doc.querySelector("#searchInput");
const searchButton = doc.querySelector("#searchButton");
const resultsDiv = doc.querySelector("#results");

const imageModal = doc.querySelector("#imageModal");
const modalImage = doc.querySelector("#modalImage");

const downloadButton = doc.querySelector("#downloadButton");

// Definir la APIKEY y la url base
const apiKey = "46557407-0a0ddfd9efbd68fafe671b704";
const url = `https://pixabay.com/api/?key=${apiKey}`;

// Funcion para realizar solicutudes a la API de pixabay
async function searchImage() {
  //232. Comprobar resultados (II)
  // Limpiamos el contenido para la nueva busqueda
  resultsDiv.innerHTML = "";

  // obtenemos el termino de busqueda ingresado por el usuario
  const query = searchInput.value;

  // Crear spinner
  const spinner = doc.createElement("div");
  spinner.classList.add("spinner");

  resultsDiv.appendChild(spinner);

  // mostrar spinner durante 5 segundos
  setTimeout(async () => {
    try {
      // realizar la solicitud HTTP en funcion del termino de busqueda
      const response = await fetch(`${url}&q=${query}&per_page=200`);

      // verificar el estado de la respuesta
      if (!response.ok)
        throw new Error("Se ha producido un error al cargar los datos.");

      // convertir la respuesta a formato JSON
      const data = await response.json();

      // 231. Comprobar resultados
      // Verificar si se encontraron imagenes según el termino de busqueda //hits viene de la API de pixabay
      if (data.hits.length === 0) {
        //mostramos mensaje de error por no encontrar comentario
        const noResultsMessage = doc.createElement("p");
        noResultsMessage.textContent =
          "No se encontraron resultados para esta busqueda, intenta nuevamente.";
        noResultsMessage.style.color = "#ff0000";
        resultsDiv.appendChild(noResultsMessage);
      } else {
        // 235. Descargar imagen
        const resultCountMessage = doc.createElement("p");
        resultCountMessage.innerHTML = `Se han encontrado <b>${data.hits.length}</b> resultados que coinciden con el termino <span>${query}</span>`;
        resultCountMessage.classList.add("numeroResultados");
        resultsDiv.appendChild(resultCountMessage);

        // Mostrar las imagenes econtradas
        data.hits.forEach((image) => {
          // crear y mostrar la miniatura de cada imagen
          const img = doc.createElement("img");
          // webformatURL viene de la API de pixabay
          img.src = image.webformatURL;
          img.alt = image.tags;
          img.addEventListener("click", () => {
            const existAuthorInfo = doc.querySelector(".author-info");
            if (existAuthorInfo) existAuthorInfo.remove();

            // mostrar la imagen en tamaño grande
            // largeImageURL viene de la API de pixabay
            modalImage.src = image.largeImageURL;
            // Author de cada imagen
            const authorInfo = doc.createElement("p");
            authorInfo.classList.add("author-info");
            // user; viene de la API de pixabay
            authorInfo.innerHTML = `<i class='fa-solid fa-camera'></i> ${image.user} <i class="fa-solid fa-tag"></i> ${image.tags}`;
            modalImage.parentElement.insertBefore(
              authorInfo,
              modalImage.nextSibiling
            );
            imageModal.style.display = "block";
          });
          resultsDiv.appendChild(img);
        });
      }
      //232. Comprobar resultados (II)
      spinner.style.display = "none";
    } catch (error) {
      console.log(error);
      spinner.style.display = "none";
    }
  }, 5000);
}

// funcion para realizar la busqueda de la imagenes
searchButton.addEventListener("click", searchImage);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchImage();
  }
});

// 233. Mostrar imágenes por defecto
doc.addEventListener("DOMContentLoaded", async () => {
  try {
    const defaultQuery = "mountains+people";
    // realizar la solicitud HTTP en funcion del termino de busqueda
    const response = await fetch(`${url}&q=${defaultQuery}&per_page=200`);

    // verificar el estado de la respuesta
    if (!response.ok)
      throw new Error("Se ha producido un error al cargar los datos.");

    // convertir la respuesta a formato JSON
    const data = await response.json();

    // Mostrar las imagenes econtradas
    data.hits.forEach((image) => {
      // crear y mostrar la miniatura de cada imagen
      const img = doc.createElement("img");
      // webformatURL viene de la API de pixabay
      img.src = image.webformatURL;
      img.alt = image.tags;
      img.addEventListener("click", () => {
        const existAuthorInfo = doc.querySelector(".author-info");
        if (existAuthorInfo) existAuthorInfo.remove();

        // mostrar la imagen en tamaño grande
        // largeImageURL viene de la API de pixabay
        modalImage.src = image.largeImageURL;
        // Author de cada imagen
        const authorInfo = doc.createElement("p");
        authorInfo.classList.add("author-info");
        // user; viene de la API de pixabay
        authorInfo.innerHTML = `<i class='fa-solid fa-camera'></i> ${image.user} <i class="fa-solid fa-tag"></i> ${image.tags}`;
        modalImage.parentElement.insertBefore(
          authorInfo,
          modalImage.nextSibiling
        );
        imageModal.style.display = "block";
      });
      resultsDiv.appendChild(img);
    });
  } catch (error) {
    console.log(error);
  }
});

// 234. Cerrar ventana modal
function closeImage() {
  imageModal.style.display = "none";
}

doc.querySelector(".close").addEventListener("click", () => {
  closeImage();
});

doc.addEventListener("click", (e) => {
  if (e.target === imageModal) {
    closeImage();
  }
});

doc.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeImage();
  }
});

// 235. Descargar imagen
// function para descargar la imagen
downloadButton.addEventListener("click", () => {
  // url imagen
  const imageURL = modalImage.src;

  // realizar solicitud para obtener la imagen
  fetch(imageURL)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      // crea enlace temporal para la descarga
      const link = doc.createElement("a");
      // crear url a partir del objeto blob
      link.href = URL.createObjectURL(blob);
      // nombre aleatorio
      const randomName = Math.floor(Math.random() * 1000000) + "_n.jpg";
      link.setAttribute("download", randomName);
      link.style.display = "nonne";
      document.body.appendChild(link);

      // simular click sobre el enlace
      link.click();

      // eliminar el enlace temporal
      doc.body.removeChild(link);
    });
});
