//infos of different caroussels on the webpage
const categories = {
    best_movie : {
        name : 'caroussel',
        title : 'Films les mieux notés',
        uri : 'http://localhost:8000/api/v1/titles/?page=1&sort_by=-imdb_score',
        nb_movies : 8
    },
    action : {
        name : 'caroussel2',
        title : "Films d'Action",
        uri : 'http://localhost:8000/api/v1/titles/?page=1&genre=action&sort_by=-imdb_score',
        nb_movies : 7
    },
    animation : {
        name : 'caroussel3',
        title : "Films d'Animation",
        uri : 'http://localhost:8000/api/v1/titles/?page=1&genre=Animation&sort_by=-imdb_score',
        nb_movies : 7
    },
    comedy : {
        name : 'caroussel4',
        title : 'Comédies',
        uri : 'http://localhost:8000/api/v1/titles/?page=1&genre=Comedy&sort_by=-imdb_score',
        nb_movies : 7
    }
}

document.addEventListener("DOMContentLoaded", function () {
    for (let category_name in categories) {
        let category = categories[category_name];
        document.querySelector('.'+category.name+'__title').textContent = category.title;
        document.querySelector('#'+category.name+'_link').textContent = category.title;
        search_for_movies(category, 0);
    }

    //add listener for clicking on movie_block->opening modal
    let movie_blocks = document.querySelectorAll(".movie-block");
    for (let movie_block of movie_blocks) {
        // if there is a button the listener is on the button only
        if (movie_block.querySelector('#my_button')) {
            movie_block = movie_block.querySelector('#my_button');
        }
        
       // movie_block.film = movie_block.classList;
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
    search_for_infos_movie(evt.currentTarget.film.url, document.querySelector(".modal"));
    console.log(evt.currentTarget.film);

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
    //if we are on a "large movie block" with detailled infos
    if (movie_block.querySelector('h1')){
        search_for_infos_movie(json_movie.url, movie_block);
    } 
    movie_block.style.backgroundImage = "url("+json_movie.image_url+")";
    
    movie_block.title = json_movie.title;

    if (movie_block.querySelector('#my_button')) {
        movie_block = movie_block.querySelector('#my_button');
    }

    //record the film in dom element and add a listener to open modal on click
    movie_block.film = json_movie;
    movie_block.addEventListener("click", openModal);
    movie_block.style.cursor = "zoom-in";
}

/**
 * function to display an array in a correct style
 */
function arrayToDisplay(array){
    return array.join(", ");
}

/**
 * function to display rated score
 */
 function ratedToDisplay(rated){
    return (rated=="Not rated or unkown rating")?"NC.":rated;
}

/**
 * function to display result depending on available information
 */
 function resultToDisplay(worldwide_gross_income, usa_gross_income){
    let result;
    if (worldwide_gross_income!=null){
        result = (worldwide_gross_income/1000000).toFixed(2) + " M$ dans le monde";
    } else if (usa_gross_income!=null){
        result = (usa_gross_income/1000000).toFixed(2) + " M$ aux USA";
    } else result = "NC.";
    return result;
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
function search_for_infos_movie(requete, block){
    fetch(requete)
    .then(function (res){
        if (res.ok){
            return res.json();
        }
    })
    .then(function (value){
        console.log(value);
        
        block.style.backgroundImage = "url("+value.image_url+")";
        if (block.querySelector('h1'))         block.querySelector('h1').textContent = value.title;
        if (block.querySelector('.genre'))         block.querySelector('.genre').textContent = arrayToDisplay(value.genres);
        if (block.querySelector('.date'))         block.querySelector('.date').textContent = value.year;
        if (block.querySelector('.rated'))         block.querySelector('.rated').textContent = ratedToDisplay(value.rated);
        if (block.querySelector('.score'))         block.querySelector('.score').textContent = value.imdb_score;
        if (block.querySelector('.director'))         block.querySelector('.director').textContent = arrayToDisplay(value.directors);
        if (block.querySelector('.actors'))         block.querySelector('.actors').textContent = arrayToDisplay(value.actors);
        if (block.querySelector('.duration'))         block.querySelector('.duration').textContent = value.duration + " min.";
        if (block.querySelector('.country'))         block.querySelector('.country').textContent = arrayToDisplay(value.countries);
        if (block.querySelector('.result'))         block.querySelector('.result').textContent = resultToDisplay(value.worldwide_gross_income, value.usa_gross_income);
        if (block.querySelector('.sum_up'))         block.querySelector('.sum_up').textContent = value.long_description;
        block.title= value.title;
   

    })
    .catch(function(err){
        console.log("Il y a eu un problème : "+err);
        console.log(requete);
    });
}