'use strict';

const SEARCH_RENDER = (function () {
    var currentPage = 0;
    var lastPage = 0;
    const PAGINATE = Number.MAX_VALUE;
    const LEFT_ARROW = '\u2190 ';
    const RIGHT_ARROW = ' \u2192';
    const TRANSLATIONS = {
        getPageLabel() {
            return ROUTES.getLanguage() == 'es' ?
                'Página ' + currentPage + ' de ' + lastPage :
                'Page ' + currentPage + ' of ' + lastPage;
        },
        getPreviousPostLabel() {
            return ROUTES.getLanguage() == 'es' ? 'Publicaciones anteriores' : 'Previous Posts';
        },
        getNextPostLabel() {
            return ROUTES.getLanguage() == 'es' ? 'Publicaciones siguientes' : 'Next Posts';
        }
    };


    function render(searchResults, documents) {
        removeSearchedPosts();
        $('nav.pagination').hide();
        searchResults.forEach((result, index) => {
            documents.forEach(post => {
                if (post.uri === result.ref) {
                    var pageNumber = Math.ceil((index + 1) / PAGINATE);
                    $('#post-feed').append(createArticle(post, pageNumber));
                }
            });
        });
        currentPage = 1;
        lastPage = Math.ceil(searchResults.length / PAGINATE);
        enablePagination();
    }


    function removeSearchedPosts() {
        $('#post-feed article.searchedPost').remove();
        disablePagination();
    }


    function disablePagination() {
        currentPage = 0;
        $('#dynamic-pagination').remove();
        $('nav.pagination').show();
    }


    function enablePagination() {
        $(createNewPagination()).insertAfter('#post-feed');
        updatePageNumber();
    }


    function createNewPagination() {
        var pagination = document.createElement('nav');
        pagination.setAttribute('id', 'dynamic-pagination');
        pagination.setAttribute('class', 'pagination');
        pagination.setAttribute('role', 'navigation');

        var nextPostButton = document.createElement('a');
        nextPostButton.setAttribute('class', 'newer-posts');
        nextPostButton.setAttribute('href', '#');
        nextPostButton.append(document.createTextNode(LEFT_ARROW));
        nextPostButton.append(createSpan(TRANSLATIONS.getNextPostLabel()));
        nextPostButton.onclick = () => {
            if (currentPage == 1) return false;
            currentPage--;
            updatePageNumber();
            return false;
        };

        var pageNumberLabel = document.createElement('span');
        pageNumberLabel.setAttribute('id', 'page-number');
        pageNumberLabel.setAttribute('class', 'page-number');
        pageNumberLabel.append(createSpan(TRANSLATIONS.getPageLabel()));

        var previousPostButton = document.createElement('a');
        previousPostButton.setAttribute('class', 'older-posts');
        previousPostButton.setAttribute('href', '#');
        previousPostButton.append(createSpan(TRANSLATIONS.getPreviousPostLabel()));
        previousPostButton.append(document.createTextNode(RIGHT_ARROW));
        previousPostButton.onclick = () => {
            if (currentPage == lastPage) return false;
            currentPage++;
            updatePageNumber();
            return false;
        };

        pagination.append(nextPostButton);
        pagination.append(pageNumberLabel);
        pagination.append(previousPostButton);
        return pagination;
    }


    function createSpan(text) {
        var span = document.createElement('span');
        span.setAttribute('class', 'hide');
        span.append(document.createTextNode(text));
        return span;
    }


    function updatePageNumber() {
        $('#dynamic-pagination .newer-posts').show();
        $('#dynamic-pagination .older-posts').show();
        if (currentPage == 1) $('#dynamic-pagination .newer-posts').hide();
        if (currentPage == lastPage) $('#dynamic-pagination .older-posts').hide();
        $('#page-number span').replaceWith(createSpan(TRANSLATIONS.getPageLabel()));
        $('#post-feed article.searchedPost').not('.page' + currentPage).hide();
        $('#post-feed article.searchedPost.page' + currentPage).show();
    }


    function createArticle(post, pageNumber) {
        var article = document.createElement('article');
        article.setAttribute('class', 'post-card post searchedPost page' + pageNumber);
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
        var link = document.createElement('a');
        link.setAttribute('class', 'post-card-author');
        link.setAttribute('href', post.authorWebsite); 
        var author = document.createElement('span');
        author.append(document.createTextNode(post.author));
        link.append(image);
        link.append(author);
        var date = document.createElement('span');
        date.setAttribute('class', 'short-date');
        date.append(document.createTextNode(post.formatedDate));
        var author_and_date = document.createElement('div');
        author_and_date.setAttribute('class', 'post-card-author-and-date');
        author_and_date.append(link);
        author_and_date.append(date);
        footer.append(author_and_date);
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


    return {
        render,
        removeSearchedPosts
    };
})();