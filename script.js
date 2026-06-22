    document.addEventListener("DOMContentLoaded",()=>{
    let movies = [];
const container = document.getElementById("movieContainer");
const closebtn=document.getElementById("closeBtn");
const modal=document.getElementById("movieModal");
closebtn.addEventListener("click",()=>{
    modal.style.display='none';
});
window.addEventListener("click",(event)=>{
    if(event.target==modal)
    {
        modal.style.display="none";
    }
});
function displayMovies(movieList) {
    container.innerHTML = "";
    if(movieList.length===0)
    {
        container.innerHTML="<h2>No movies found</h2>";
        return;
    }
    movieList.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.genre}</p>
            <p>⭐${movie.rating}</p>
            <p>${movie.description.substring(0,50)}...</p>
            <button onclick="addToFavorites(event,'${movie.title}')">❤️ Favorite</button>
            <button onclick="removeFromFavorites('${movie.title}')">❌ remove</button>
        `;

        card.addEventListener("click", () => {
            showMovieDetails(movie);
        });

        container.appendChild(card);
    });
}
function showMovieDetails(movie) {
    document.getElementById("modalImage").src=movie.image;
    document.getElementById("modalTitle").textContent =
        movie.title;

    document.getElementById("modalGenre").textContent =
        "Genre: " + movie.genre;

    document.getElementById("modalRating").textContent =
        "Rating: " + movie.rating;

    document.getElementById("movieModal").style.display =
        "flex";
    document.getElementById("modalDescription").textContent=movie.description;
}
fetch("movies.json")
    .then(response => response.json())
    .then(data => {
        movies = data;
        displayMovies(movies);
    });
    const searchBox=document.getElementById("searchBox");
searchBox.addEventListener("input",(e)=>{
    const value=e.target.value.toLowerCase();
const filtered=movies.filter(movie=>
    movie.title.toLowerCase().includes(value));
    displayMovies(filtered);
})
function filterMovies(genre) {
    if (genre === "All") {
        displayMovies(movies);
    } else {
        const filteredMovies = movies.filter(
            movie => movie.genre === genre
        );
        displayMovies(filteredMovies);
    }
}

window.filterMovies = filterMovies;
document.getElementById("sortSelect")
.addEventListener("change", function() {

    let sortedMovies = [...movies];

    if (this.value === "rating") {
        sortedMovies.sort((a, b) => b.rating - a.rating);
    }

    if (this.value === "name") {
        sortedMovies.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    displayMovies(sortedMovies);
});
function addToFavorites(event,title)
{
    event.stopPropagation();
    let movie=movies.find(
        m => m.title===title);
    let favorites=JSON.parse(localStorage.getItem("favorites"))||[];
    let exists=favorites.some(fav=> fav.title===title);
    if(!exists)
    {
        favorites.push(movie);
    }
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites
        )
    );
    updaateFavoriteCount();
    alert("Added to Favorites!");
}
window.addToFavorites=addToFavorites;
function removeFromFavorites(title)
{
    let favorites=JSON.parse(
        localStorage.getItem("favorites"))||[];
        favorites=favorites.filter(movie=>movie.title!==title);
        localStorage.setItem("favorites",JSON.stringify(favorites));
    showFavorites();
}
window.removeFromFavorites=removeFromFavorites;
function clearFavorites()
{
    localStorage.removeItem("favorites");
    updateFavoriteCount();
    displayMovies(movies);
}
function showFavorites(){
    let favs=JSON.parse(
        localStorage.getItem("favorites"))||[];
        container.innerHTML="";
        favs.forEach(movie => {
            const card=document.createElement("div");
             card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.genre}</p>
            <p>⭐${movie.rating}</p>
            <p>${movie.description.substring(0,50)}...</p>
            <button onclick="addToFavorites(event,'${movie.title}')">❤️ Favorite</button>
        `;
         container.appendChild(card);
        })
}
window.showFavorites=showFavorites;
window.showRecommended=showRecommended;
function updateFavoriteCount(){
    let favorites=JSON.parse(localStorage.getItem("favorites"))||[];
    document.getElementById("favCount").textContent=favorites.length;
}
updateFavoriteCount();
function showRecommended(){
const recommended=movies.filter(
    movie =>movie.rating >=8.5
);
displayMovies(recommended);
}

});