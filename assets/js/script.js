var moodForm = document.getElementById("mood-form");
var moodButton = document.getElementById("mood-button");
var videoList = document.getElementById("video-list");
var songList = document.getElementById("song-list");
var movieList = document.getElementById("movie-list");
var ytAPIkey = "AIzaSyD8nsKtJy1r4v8Cn0l0CY6kRVXl9ARsrjg";

var initialVideoID = 'M7lc1UVf-VE';
var maxResults = 10;
var videoLicenseType = "creativeCommon"
var videoEmbed = true;
var ytSearchType = "video";
var getFeelsResultYT;
var arrayYTVideoIds = [];

var savedContent = [];

moodForm.addEventListener("submit", (event) => {
  var moodSelection = document.getElementById("mood-selections");
  var value = moodSelection.value;
  var text = moodSelection.options[moodSelection.selectedIndex].text;
  console.log("hello");
  console.log(value);
  console.log(text);
  event.preventDefault();
  getYoutubeContent(value);
});

function getYoutubeContent(value) {
  var queryUrl = `https://www.googleapis.com/youtube/v3/search?key=${ytAPIkey}&q=${value}&videoEmbeddable=${videoEmbed}&videoLicense=${videoLicenseType}&type=${ytSearchType}&maxResults=${maxResults}`;
  fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      getFeelsResultYT = data;
      for (var i = 0; i < getFeelsResultYT.items.length; i++) { 
        var vid = getFeelsResultYT.items[i]; 
        console.log("vidID:", vid.id.videoId);
        arrayYTVideoIds.push(vid.id.videoId);
      }
      arrayYTVideoIds = [...arrayYTVideoIds].sort(() => 0.5 - Math.random());
      console.log("arrayYTVideoIds", arrayYTVideoIds);
      player.loadPlaylist(arrayYTVideoIds);
    });
};

moodForm.addEventListener("submit", (event) => {
  var moodSelection = document.getElementById("mood-selections");
  var value = moodSelection.value;
  var text = moodSelection.options[moodSelection.selectedIndex].text;
  console.log("hello");
  console.log(value);
  console.log(text);
  event.preventDefault();
  getYoutubeContent(value);
  arrayYTVideoIds = [];
});

var savedList = (text) => {
  var savedLi = document.createElement("li");
  cityLi.innerHTML = text;
  savedList.appendChild(savedLi);
  // savedLi.addEventListener('click', function () {
  //     getYoutubeContent(this.textContent);
  // })
};

function getYoutubeContent(value) {
  var queryUrl = `https://www.googleapis.com/youtube/v3/search?key=${ytAPIkey}&q=${value}&videoEmbeddable=${videoEmbed}&videoLicense=${videoLicenseType}&type=${ytSearchType}&maxResults=${maxResults}`;
  fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      getFeelsResultYT = data;
      for (var i = 0; i < getFeelsResultYT.items.length; i++) { 
        var vid = getFeelsResultYT.items[i]; 
        console.log("vidID:", vid.id.videoId);
        arrayYTVideoIds.push(vid.id.videoId);
      }
      arrayYTVideoIds = [...arrayYTVideoIds].sort(() => 0.5 - Math.random());
      console.log("arrayYTVideoIds", arrayYTVideoIds);
      player.loadPlaylist(arrayYTVideoIds);
      var currentVideoId = arrayYTVideoIds[0];
      savedContent.push(currentVideoId);
      console.log(savedContent);
      localStorage.setItem("saved-content", JSON.stringify(savedContent));
      var example = localStorage.getItem("saved-content");
      example = JSON.parse(example);
      console.log(example);
    });
};

//Youtube API player code
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var player;
// function onYouTubeIframeAPIReady() {
//   player = new YT.Player('player', {
//     height: '390',
//     width: '640',
//     videoId: 'DW3tI9HCslo',
//     playerVars: {
//       'playsinline': 1
//     },
//     events: {
//       'onReady': onPlayerReady,
//       'onStateChange': onPlayerStateChange
//     }
//   });
// }

function onPlayerReady(event) {
    event.target.playVideo();
  }
  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
  }
  function stopVideo() {
    player.stopVideo();
  }
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: initialVideoID,
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
//End of youtube API code

