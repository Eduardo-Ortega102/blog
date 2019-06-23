'use strict';
const ENTER = 13;
var index = null;
var documents = [];
var thereIsSearch = false;
const locations = ['post', 'about', 'categories'];


function hideAllArticles() {
    var articles = $('#post-feed article');
    for (var i = 0; i < articles.length; i++) {
        articles[i].style.display = 'none';
    }
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
    console.log('resultados: ' + searchResults.length);
    if (searchResults.length > 0) {
        thereIsSearch = true;
        hideAllArticles();
        removeSearchedPosts(); 
    } else {
        showTooltip();
    }
    searchResults.forEach(result => {
        documents.forEach(post => {
            if (post.uri === result.ref) render(post);
        });
    });
}


function showTooltip() {
    var searchTooltip = $('.search-wrapper .speech-bubble');
    searchTooltip.css({ visibility: 'visible', opacity: 1 });
    setTimeout(() => searchTooltip.css({ visibility: 'hidden', opacity: 0 }), 2000);
}

function clearSearch() {
    $('.search-query').val('');
    removeSearchedPosts();
    showHiddenPosts();
    hideCancelSearchButton();
    thereIsSearch = false;
}


function removeSearchedPosts() {
    $('#post-feed article.searchedPost').remove();
}


function showHiddenPosts() {
    $('#post-feed article').css({ display: 'flex' });
}


function render(post) {
    $('#post-feed').append(createArticle(post));
}

function createArticle(post) {
    var article = document.createElement('article');
    article.setAttribute('class', 'post-card post searchedPost');
    article.append(createArticleHeader(post));
    article.append(createArticleContent(post));
    return article;
}


function createArticleHeader(post) {
    var link = document.createElement('a');
    link.setAttribute('class', 'post-card-image-link');
    link.setAttribute('href', post.uri);
    var image = document.createElement('div');
    image.setAttribute('class', 'post-card-image');
    image.setAttribute('style', 'background-image: url(' + ROUTES.ROOT + post.image + ')');
    link.append(image);
    return link;
}


function createArticleContent(post) {
    var content = document.createElement('div');
    content.setAttribute('class', 'post-card-content');
    var link = document.createElement('a');
    link.setAttribute('class', 'post-card-content-link');
    link.setAttribute('href', post.uri);
    link.append(createHeader(post));
    link.append(createSection(post));
    content.append(link);
    content.append(createArticleFooter(post));
    return content;
}

function createHeader(post) {
    var header = document.createElement('header');
    header.setAttribute('class', 'post-card-header');
    var title = document.createElement('h2');
    title.setAttribute('class', 'post-card-title');
    title.append(document.createTextNode(post.title));
    header.append(title);
    return header;
}

function createSection(post) {
    var section = document.createElement('section');
    section.setAttribute('class', 'post-card-excerpt');
    var paragraph = document.createElement('p');
    paragraph.append(document.createTextNode(post.summary));
    section.append(paragraph);
    return section;
}

function createArticleFooter(post) {
    var footer = document.createElement('footer');
    footer.setAttribute('class', 'post-card-meta');
    if (post.categories) {
        footer.append(createCategories(post));
    }
    var image = document.createElement('img');
    image.setAttribute('class', 'author-profile-image');
    image.setAttribute('src', ROUTES.ROOT + post.avatar);
    var author = document.createElement('span');
    author.setAttribute('class', 'post-card-author');
    var link = document.createElement('a');
    link.setAttribute('href', '/'); //TODO: add author website
    link.append(document.createTextNode(post.author));
    author.append(link);
    var date = document.createElement('span');
    date.setAttribute('class', 'short-date');
    date.append(document.createTextNode(post.formatedDate));
    footer.append(image);
    footer.append(author);
    footer.append(date);
    return footer;
}

function createCategories(post) {
    var categories = document.createElement('span');
    categories.setAttribute('class', 'post-card-tags');
    for (var i = 0; i < post.categories.length; i++) {
        var link = document.createElement('a');
        link.setAttribute('href', ROUTES.getCategoriesUrl() + post.categories[i]);
        link.append(document.createTextNode(post.categories[i]));
        categories.append(link);
    }
    return categories;
}


$(document).ready(function () {
    function isHomePage() {
        for (const i in locations) {
            if (window.location.pathname.includes(locations[i])) return false;
        }
        return true;
    }

    if (isHomePage()) {
        $.getJSON(ROUTES.getBaseUrl() + 'index.json', function (data) {
            documents = data;
            console.log(documents);
            index = lunr(function () {
                this.ref('uri');
                this.field('title');
                this.field('summary');
                documents.forEach((document) => this.add(document), this);
            });
        });
    }
});