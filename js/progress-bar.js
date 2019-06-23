'use strict';
$(document).ready(function () {
    //return $(document).height() - $(window).height();
    var getMax = () => $('article.post-card.post').height() - $(window).height();
    var getValue = () => $(window).scrollTop();
    var getWidth = () => {
        var width = (getValue() / getMax()) * 100;
        if (width > 0.8) {
            $('.progress-bar-container').addClass('stuck');
        } else {
            $('.progress-bar-container').removeClass('stuck');
        }
        return width + '%';
    }

    var progressBar = $('.progress-bar');
    var setWidth = () => progressBar.css({ width: getWidth() });

    setWidth();
    $(document).on('scroll', setWidth);
    $(window).on('resize', () => setWidth());
});