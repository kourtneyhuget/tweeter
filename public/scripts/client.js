/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  $('#tweet-form').on('submit', submitHandler);
  loadtweets();
});

// getting the tweet from the database 
const loadtweets = function () {
  $.ajax('/tweets/', { method: 'GET' })
    .then(function (res, err) {
      renderTweets(res);
    });
};

// function to use ajax rather than page needing to be refreshed when new tweet is submitted
const submitHandler = function (event) {
  event.preventDefault();
  const $form = $(this);
  const text = $form.serialize();
  const counterNum = $('#tweet-text').val().length;
  const sectionFind = $form.closest('section');
  const errorMessage = sectionFind.find('.error-message');
  if (counterNum > 140 || counterNum === 0) {
    $(".error-message").slideDown();
    errorMessage.addClass('error-message-visible');
  } else {
    $.ajax({
      method: "POST",
      url: "/tweets/",
      data: text
    }).then(function () {
      $('.error-message').slideDown();
      errorMessage.removeClass('error-message-visible');
      document.getElementById("tweet-form").reset();
      $.ajax('/tweets/', { method: 'GET' })
        .then(function (res, err) {
          renderTweets([res[res.length - 1]]);
        });
    });
  }
};

// render a tweet by looping through an array of objects
const renderTweets = function (tweets) {
  const $container = $(".tweets-container");
  $('.counter').html(140);
  for (let tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    $container.prepend($tweetElement);
  }
};

// XSS function
const escape = function (str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function (tweet) {
  const dateObj = new Date(tweet.created_at * 1000);
  const utcString = dateObj.toUTCString();
  console.log(utcString);
  time = utcString.slice(0, 11);
  const $tweet = $(`<article class="display-tweet">
  <header class="header-tweet-child">
  <div>
  <img src='${tweet.user.avatars}'/>
  <p class="name">${tweet.user.name}</p>
  </div>
  <p class="handle">${tweet.user.handle}</p>
  </header >
  <p class="tweet">${escape(tweet.content.text)}</p> 
  <footer class="footer-tweet-child">
  <p class="days-ago">${time}</p>
  <p class="icons"> 	&#128681 &#x1f501 &#128420 </p>
  </footer>
  </article >;`);
  return $tweet;
};


