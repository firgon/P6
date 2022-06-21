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
    
document.addEventListener("DOMContentLoaded", function () {
    //add listener for clicking on movie_block->opening modal
    let movie_blocks = document.querySelectorAll(".movie-block");
    for (const movie_block of movie_blocks) {
        movie_block.addEventListener("click", openModal);
        movie_block.film = movie_block.classList;
    }

    //add listener on modal to close it
    let modal = document.querySelector(".modal");
    let overlay = document.querySelector(".overlay");
    modal.addEventListener("click", function(evt){
        overlay.style.display = "none";
    });


    //add listener on arrows on each category
    for (const category_name in categories) {
        let category = categories[category_name];
        let left_arrow = document.querySelector("#" + category.name +'_left');
        let right_arrow = document.querySelector('#'+ category.name +'_right');
        let caroussel = document.querySelector('#'+ category.name +'_movie_blocks');
    
        left_arrow.addEventListener("click", function(evt){
            console.log("Je décale à gauche");
            evt.stopPropagation();
            evt.preventDefault();

            let movie_blocks = caroussel.querySelectorAll(".movie-block");

            let lastChild = movie_blocks[movie_blocks.length-1];
            let firstChild = movie_blocks[0]
            console.log(firstChild);
            caroussel.insertBefore(lastChild, firstChild);
        })

        right_arrow.addEventListener("click", function(evt){
            console.log("Je décale à droite");
            evt.stopPropagation();
            evt.preventDefault();
            
            console.log(caroussel.querySelector(".movie-block"));
            caroussel.appendChild(caroussel.querySelector(".movie-block"));
        })
    }
    
    
  });


function openModal(evt) {
    document.querySelector(".overlay").style.display = "block";
    search_for_infos_movie(evt.currentTarget.film.url);
    

}

function add_movie_in_caroussel(json_movie,caroussel,index){
    let element = document.querySelector('#'+caroussel+'_movie_'+index);
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
        let i = 0;
        for ( ; i < value.results.length && index+i<category.nb_movies; i++) {
            let element = value.results[i];
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
function search_for_infos_movie(requete){
    fetch(requete)
    .then(function (res){
        if (res.ok){
            return res.json();
        }
    })
    .then(function (value){
        console.log(value);
        
        let modal = document.querySelector(".modal");
        modal.style.backgroundImage = "url("+value.image_url+")";
        modal.querySelector('h1').textContent = value.title;
        modal.title= value.title;
    
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


    })
    .catch(function(err){
        console.log("Il y a eu un problème : "+err);
        console.log(requete);
    });
}