
function changeLanguage(newLanguage) { 
    var url = window.location.href;
    const language = url.includes('/es/') ? '/es/' : '/en/';
    window.location.href = url.replace(language, '/' + newLanguage + '/');
}

function toggleMenu() { 
    var menu = document.getElementById('navigation-bar');
    if (menu.classList.contains('responsive')) {
        closeMenu(menu);
    } else {
        openMenu(menu);
    }
}

function closeMenu(menu) { 
    var content = document.querySelector('#navigation-bar .navigation-content');
    content.classList.add('fadeOutUp');
    setTimeout(() => {
        menu.classList.remove('responsive');
        content.classList.remove('fadeOutUp', 'animation-finished');
    }, 500);
}

function openMenu(menu) { 
    menu.classList.add('responsive');
    var content = document.querySelector('#navigation-bar .navigation-content');
    content.classList.add('fadeInDown');
    setTimeout(() => {
        content.classList.replace('fadeInDown', 'animation-finished');
    }, 750);
}

function openLanguageMenu() { 
    var menu = document.querySelector('#languageDropdown');
    if (menu.classList.contains('fadeInDown')) {
        menu.classList.replace('fadeInDown', 'fadeOutUp');
        setTimeout(() => {
            menu.classList.remove('fadeOutUp', 'show');
        }, 500);
    } else {
        menu.classList.add('fadeInDown', 'show');
        setTimeout(() => {
            menu.classList.add('animation-finished');
        }, 750);
    }
}

window.onclick = function (event) {
    var clickedElement = event.target;
    if (!clickedElement.matches('.dropdown')) {
        var languageDropdown = document.getElementById('languageDropdown');
        if (languageDropdown.classList.contains('show')) {
            languageDropdown.classList.remove('show');
        }
        var menuSwitch = document.getElementById('menu-switch');
        if (clickedElement !== languageDropdown &&
            clickedElement !== menuSwitch && !menuSwitch.contains(clickedElement)) {
            var menu = document.getElementById('navigation-bar');
            if (menu.classList.contains('responsive')) {
                closeMenu(menu);
            }
        }
    }
};