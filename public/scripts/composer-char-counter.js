$(document).ready(function () {
  $("#tweet-text").keyup(function (event) {
    const $input = $(this);
    // going up the tree
    const form = $input.closest('form');
    // going back down the tree
    const counter = form.find('.counter');
    const counterInput = (140 - $input.val().length);
    counter.html(counterInput);
    if (counterInput < 0) {
      counter.addClass('redColor');
    } else {
      counter.removeClass('redColor');
    }
  });
});

