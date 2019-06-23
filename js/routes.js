'use strict';
const ROUTES = (function router() {

    return Object.freeze({
        ROOT: '/blog/',
        getBaseUrl() {
            const language = window.location.pathname.includes('/es/') ? 'es/' : 'en/';
            return this.ROOT + language;
        },
        getCategoriesUrl() {
            return this.getBaseUrl() + 'categories/';
        },
        getImagesUrl() {
            return this.ROOT + 'img/';
        },
        getLanguage(){
            return window.location.pathname.includes('/es/') ? 'es' : 'en';
        }
    });
})();