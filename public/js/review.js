function showFilm(index) {
  let header_items = document.getElementsByClassName("header-item");
  let list_films = document.getElementsByClassName("list-film");
  for (let i = 0; i < header_items.length; i++) {
    header_items[i].style.opacity = 0.7;
    header_items[i].style.color = "whitesmoke";
    header_items[i].style.backgroundColor = "#2f2f2f";
    list_films[i].style.display = "none";
  }

  header_items[index].style.opacity = 1;
  header_items[index].style.color = "white";
  header_items[index].style.backgroundColor = "#2c2c2c";
  list_films[index].style.display = "flex";
}

showFilm(0);

const leftButtons = document.querySelectorAll('.left-button');
const rightButtons = document.querySelectorAll('.right-button');

leftButtons.forEach(item => {
    let slider = document.querySelector(`#${item.getAttribute('data-slider')}`);
    item.addEventListener('click', () => {
        slider.scrollBy({
          left: -200, // Adjust the scroll distance as needed
          behavior: 'smooth'
        });
    });
});


rightButtons.forEach(item => {
    let slider = document.querySelector(`#${item.getAttribute('data-slider')}`);
    item.addEventListener('click', () => {
        slider.scrollBy({
          left: 200, // Adjust the scroll distance as needed
          behavior: 'smooth'
        });
    });
});

function getMovieId() {
  // Get link for FB sharing
  document.querySelector(".fb-share-button").setAttribute("data-href", window.location.href);

  // Get ID
  const id = parseInt(window.location.pathname.split("/").pop());
  if (id && document.querySelector("#input_movieId")) {
    document.querySelector("#input_movieId").value = id;
  }
  
}
window.addEventListener('hashchange', getMovieId);
window.addEventListener('popstate', getMovieId);
getMovieId();




