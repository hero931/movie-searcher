'use strict';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

//function to get data from NYT
function getDataFromNyt(){
    $('.js-results-page').addClass('hidden');
    $('.js-no-results-page').addClass('hidden');    
    $(".js-search-form").submit(function(){
        event.preventDefault();        
        const query = $('.js-query').val();
        const outcome = $('.js-outcome');                                      
        let url = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
        url += '?' + $.param({
            'api-key': "1b45aab26c4f43869d611a4c1ff2c95d",
            'query': `${query}`            
        });
        $.ajax({
            url: url,
            method: 'GET',                
        }).done(function(result) {                        
            for(let i = 0; i < result.results.length; i ++){
                if($('.js-query').val()){
                    $('.js-search-page').addClass('hidden');
                    $('.js-results-page').removeClass('hidden');
                    outcome.append(`<div class="row"><div class="col-12">
                    <div class="movie"><p><h4><a target="_blank" href=${'http://www.nytimes.com/movies/review' + result.results[i].url}>${result.results[i].display_title}</a></h4></p>
                        ${result.results[i].headline}<br><br>
                            ${result.results[i].summary_short}</div></div></div>`);                           
                } else if(!$('.js-query').val()){
                            $('.js-search-page').addClass('hidden');
                            $('.js-results-page').addClass('hidden');
                            $('.js-no-results-page').removeClass('hidden');                    
                        }                                                
            };
            // clear out the input
            $('.js-query').val("");    
            }).fail(function(err) {
                throw err;
            });            
            getYoutubeDataFromApi(query, displayYoutubeSearchData);                
    });
}

//function to get data from YouTube API
function getYoutubeDataFromApi(searchTerm, callback) {
    if($('.js-query').val()){
        const query = {
            part: 'snippet',
            key: 'AIzaSyCo3Hc6JwT7iXeFvOUuVJOyoQPHOlWeUd4',
            q: `${searchTerm} NYT movie reviews`,   
            maxResults: "2"             
        }            
        $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
    }    
            
}

//function to render the YouTube results
function renderYoutubeResult(result) {
    return `  
        <div class="result-thumbnail" tabindex="0">	  
            <h2>${result.snippet.title}</h2>	  
            <a target="_blank" href=${'https://www.youtube.com/watch?v=' + result.id.videoId}>
                <img src="${result.snippet.thumbnails.medium.url}" alt="video">		  
            </a>
        </div>    
      `;
}

//function to join the html srtings and place on the DOM
function displayYoutubeSearchData(data) {	
	const results = data.items.map((item,index) => renderYoutubeResult(item));
	$('.js-youtube').html(results);	
}

//function to no results
function resetForm(){
    $('.js-try-again').click(event =>{
        $('.js-search-page').removeClass('hidden');
        $('.js-no-results-page').addClass('hidden');               
    })
}

//function to run a new search
function newSearch(){
    $('.js-search-again').click(event =>{
        $('.js-search-page').removeClass('hidden');
        $('.js-no-results-page').addClass('hidden');
        $('.js-results-page').addClass('hidden');
    })
}

//function to run functions
function init(){
    getDataFromNyt();
    resetForm();
    newSearch();
}

$(init);



