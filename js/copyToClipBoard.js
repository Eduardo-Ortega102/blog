'use strict';

function setTooltip(caller){
    const style = {
        visibility: 'visible',
        opacity: 1
    };
    caller.siblings().css(style);
}

function removeTooltip(caller){
    const style = {
        visibility: 'hidden',
        opacity: 0
    };
    setTimeout(() => caller.siblings().css(style), 2000);
}

function copyToClipboard(caller) {
    var element = document.createElement('textarea');
    element.value = window.location.href;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
    var $caller = $(caller);
    setTooltip($caller);
    removeTooltip($caller);
}
