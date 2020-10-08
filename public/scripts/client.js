/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  $('#tweet-form').on('submit', submitHandler);
  loadtweets();
});

const loadtweets = function () {
  $.ajax('/tweets/', { method: 'GET' })
    .then(function (res, err) {
      renderTweets(res);
    });
};

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
      $('.error-message').slideUp();
      errorMessage.removeClass('error-message-visible');
      console.log('Successfully submitted');
      document.getElementById("tweet-form").reset();
      $.ajax('/tweets/', { method: 'GET' })
        .then(function (res, err) {
          renderTweets([res[res.length - 1]]);
        });
    });
  }
};

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png",
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd"
//     },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ];

const renderTweets = function (tweets) {
  const $container = $(".tweets-container");
  $('.counter').html(140);
  for (let tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    console.log("create tweet", $tweetElement);
    $container.prepend($tweetElement);
  }
};

const escape = function (str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function (tweet) {
  const dateObj = new Date(tweet.created_at * 1000);
  const utcString = dateObj.toUTCString();
  time = utcString.slice(-11, -4);
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
  <p class="icons"> &#127988 &#x2794 &#10084 </p>
  </footer>
  </article >;`);
  return $tweet;
};


