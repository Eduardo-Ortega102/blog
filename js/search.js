'use strict';
const ENTER = 13;
var index = null;
var documents = [];
var thereIsSearch = false;


function hideAllArticles() {
    $('#post-feed article').hide();
}


function searchWithEnter(input) {
    var text = input.value.trim();
    if (text.length > 0) {
        showCancelSearchButton();
        if (event.keyCode === ENTER) search(text);
    } else {
        if (!thereIsSearch) hideCancelSearchButton();
    }
}


function showCancelSearchButton() {
    $('.search-wrapper .cancel-search').addClass('visible');
}

function hideCancelSearchButton() {
    $('.search-wrapper .cancel-search').removeClass('visible');
}


function searchWithButton() {
    var text = $('.search-query').val().trim();
    if (text.length > 0) search(text);
}


function search(text) {
    var searchResults = index.search(text);
    //console.log('resultados: ' + searchResults.length);
    if (searchResults.length > 0) {
        thereIsSearch = true;
        hideAllArticles();
        SEARCH_RENDER.render(searchResults, documents);
    } else {
        showTooltip();
    }
}


function showTooltip() {
    var searchTooltip = $('.search-wrapper .speech-bubble');
    searchTooltip.css({ visibility: 'visible', opacity: 1 });
    setTimeout(() => searchTooltip.css({ visibility: 'hidden', opacity: 0 }), 2000);
}


function clearSearch() {
    thereIsSearch = false;
    $('.search-query').val('');
    SEARCH_RENDER.removeSearchedPosts();
    showHiddenPosts();
    hideCancelSearchButton();
}


function showHiddenPosts() {
    $('#post-feed article').show();
}


$(document).ready(function () {
    $.getJSON(ROUTES.getBaseUrl() + 'index.json', function (data) {
        documents = data;
        //console.log(documents);
        index = lunr(function () {
            this.ref('uri');
            this.field('title');
            this.field('summary');
            this.field('categories');
            documents.forEach((document) => this.add(document), this);
        });
    });
});