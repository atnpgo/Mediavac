
/* global $ */

$('form').submit(e => {
    e.preventDefault();
    $('iframe').attr('src', $('input').val());
});