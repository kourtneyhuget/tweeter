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
  if (counterNum >= 140) {
    alert('Maximum characters exceeded');
  } else if (counterNum === 0) {
    alert('Please create a valid tweet');
  } else {
    $.ajax({
      method: "POST",
      url: "/tweets/",
      data: text
    }).then(function () {
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
  $container.html('');
  for (let tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    console.log("create tweet", $tweetElement);
    $container.prepend($tweetElement);
  }
};

const escape = function (str) {
  let p = document.createElement('p');
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
};

const safeHTML = `<p>${escape(text.user.handle)}</p>`;

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
    safeHTML
    <footer class="footer-tweet-child">
    <p class="days-ago">${time}</p>
    <p class="icons"> &#127988 &#x2794 &#10084 </p>
    </footer>
    </article >;`);
  return $tweet;
};


// <p class="tweet">${tweet.content.text}</p> 
