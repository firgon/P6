//infos of different caroussels on the webpage
const categories = {
    best_movie : {
        name : 'caroussel',
        uri : 'http://localhost:8000/api/v1/titles/?page=1&sort_by=-imdb_score',
        nb_movies : 8
    },
    action : {
        name : 'caroussel2',
        uri : 'http://localhost:8000/api/v1/titles/?page=1&genre=action&sort_by=-imdb_score',
        nb_movies : 7
    }
}

for (let category_name in categories) {
    let category = categories[category_name];
    search_for_movies(category, 0);
}
//search_for_main_movie('http://localhost:8000/api/v1/titles/?page=1&sort_by=-imdb_score');
//search_for_movies('http://localhost:8000/api/v1/titles/?page=1&sort_by=-imdb_score',0);
    
document.addEventListener("DOMContentLoaded", function () {
    let main_movie_blocks = document.querySelectorAll(".movie-block");
    for (const movie_block of main_movie_blocks) {
        movie_block.addEventListener("click", openPopUp);
        movie_block.film = movie_block.classList;
    }

    document.body.addEventListener("mouseup", function(evt){ mouseIsUp = true})

    for (const category_name in categories) {
        let category = categories[category_name];
        let left_arrow = document.querySelector("#" + category.name +'_left');
        let right_arrow = document.querySelector('#'+ category.name +'_right');
        let caroussel = document.querySelector('#'+ category.name +'_movie_blocks');
    
        left_arrow.addEventListener("mousedown", function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            /*if (caroussel.style.left == '') caroussel.style.left = "-1px";
            else {
                let value = parseInt(caroussel.style.left)
                if (value>-1000) {
                    caroussel.style.left = (--value) + "px";
                }
            }
        */
            caroussel.insertBefore(caroussel.lastChild, caroussel.firstChild);
        })
        right_arrow.addEventListener("mousedown", function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            /*if (caroussel.style.left == '') caroussel.style.left = "1px";
            else {
                let value = parseInt(caroussel.style.left)
                if (value<1000) {
                    caroussel.style.left = (++value) + "px";
                    console.log(caroussel.style.left);
                }
            }*/
            console.log("je décale!");
            caroussel.appendChild(caroussel.firstChild);
        })
    }
    
    
  });


function openPopUp(evt) {
    console.log(evt.currentTarget.film.url);
    /*
    L’image de la pochette du film
Le Titre du film
Le genre complet du film
Sa date de sortie
Son Rated
Son score Imdb
Son réalisateur
La liste des acteurs
Sa durée
Le pays d’origine
Le résultat au Box Office
Le résumé du film*/
}

function add_movie_in_caroussel(json_movie,caroussel,index){
    element = document.querySelector('#'+caroussel+'_movie_'+index);
    add_movie_in_movie_block(element, json_movie);
}

/**
 * function to add movie information in a movie block
 * 
 * @param {DOM Element} movie_block 
 * @param {JSON} json_movie 
 */
function add_movie_in_movie_block(movie_block, json_movie){
    movie_block.style.backgroundImage = "url("+json_movie.image_url+")";
    movie_block.film = json_movie;
    movie_block.title = json_movie.title;
}


/**
 * Recursive function to search for {max} movies in a category
 */
function search_for_movies(category, index){
    fetch(category.uri)
    .then(function (res){
        if (res.ok){
            return res.json();
        }
    })
    .then(function (value){
        console.log(value);
        for (var i = 0; i < value.results.length && index+i<category.nb_movies; i++) {
            let element = value.results[i];
            console.log(index+i);
            add_movie_in_caroussel(element,category.name,index+i);
        }
        if (index+i < category.nb_movies){
            category.uri = value.next;
            search_for_movies(category, index+i);
        }

    })
    .catch(function(err){
        console.log("Il y a eu un problème"+err);
    });
}

/**
 * Function to search for the main movie, on top of the page
 */
function search_for_main_movie(requete){
    fetch(requete)
    .then(function (res){
        if (res.ok){
            return res.json();
        }
    })
    .then(function (value){
        element = document.querySelector("#main_movie");
        add_movie_in_movie_block(element,value.results[0]);

    })
    .catch(function(err){
        console.log("Il y a eu un problème : "+err);
    });
}