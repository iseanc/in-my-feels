var moodForm = document.getElementById("mood-form");

var moodButton = document.getElementById("mood-button");
var savedButton = document.getElementById("vid-history-button");

var savedContentList = document.getElementById("saved-content");
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

// gets the selected mood value and executes content search (video)
moodForm.addEventListener("submit", (event) => {
    var moodSelection = document.getElementById("mood-selections");
    var value = moodSelection.value;
    var text = moodSelection.options[moodSelection.selectedIndex].text;

    event.preventDefault();
    // fetch YouTube content
    getYoutubeContent(value);
    arrayYTVideoIds = [];

    // fetch Mixcloud content
    getMixcloudContent(value);
});

// fetch content from youtube
function getYoutubeContent(value) {
    var queryUrl = `https://www.googleapis.com/youtube/v3/search?key=${ytAPIkey}&q=${value}&videoEmbeddable=${videoEmbed}&videoLicense=${videoLicenseType}&type=${ytSearchType}&maxResults=${maxResults}`;
    fetch(queryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            getFeelsResultYT = data;
            for (var i = 0; i < getFeelsResultYT.items.length; i++) {
                var vid = getFeelsResultYT.items[i];
                arrayYTVideoIds.push(vid.id.videoId);
            }
            arrayYTVideoIds = [...arrayYTVideoIds].sort(() => 0.5 - Math.random());
            player.loadPlaylist(arrayYTVideoIds);
            localStorage.setItem("saved-content", JSON.stringify(arrayYTVideoIds));
            var example = localStorage.getItem("saved-content");

            //*****************
            // SEANC: 11/2/2022: THIS WAS INTENDED FOR MULTI-ENTRY HISTORY
            // OF VIDEO PLAYLISTS  TO BE RETRIEVABLE FROM LOCALSTORAGE
            // ****************
            // var savedContent = (text) => {
            //     var savedButton = document.createElement("button");
            //     savedButton.setAttribute("data-playlist", text);
            //     savedButton.innerHTML = "Last Playlist";
            //     savedContentList.appendChild(savedButton);
            //     savedButton.addEventListener('click', function () {
            //         //alert(this.getAttribute("data-playlist"));
            //         getYoutubeContent2();
            //         // console.log(savedButton);
            //     })
            // };
            // savedContent(example);
        });
};

savedButton.addEventListener('click', function () {
    getYoutubeContent2();
});

function getYoutubeContent2() {
    savedContent = JSON.parse(localStorage.getItem("saved-content"),);
    player.loadPlaylist(savedContent);
}

//************
//This was intended to recall the API and play a specified playlist, however oit was simplified above without having to fetch again
//************
// function getYoutubeContent2(value) {
//     var queryUrl = `https://www.googleapis.com/youtube/v3/search?key=${ytAPIkey}&q=${value}&videoEmbeddable=${videoEmbed}&videoLicense=${videoLicenseType}&type=${ytSearchType}&maxResults=${maxResults}`;
//     fetch(queryUrl)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             console.log(data);
//             alert(value);
//             getFeelsResultYT = data;
//             for (var i = 0; i < getFeelsResultYT.items.length; i++) {
//                 var vid = getFeelsResultYT.items[i];
//                 console.log("vidID:", vid.id.videoId);
//                 arrayYTVideoIds.push(vid.id.videoId);
//             }
//             console.log("arrayYTVideoIds", arrayYTVideoIds);
//             player.loadPlaylist(arrayYTVideoIds);
//         });
// };

//Youtube API player code
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// starts playing video when player is ready
function onPlayerReady(event) {
    event.target.playVideo();
}
// plays video for 6 seconds, then stops
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 1000);
        done = true;
    }
}
// stop video playback
function stopVideo() {
    player.stopVideo();
}

var player;
// creates a new YouTube video viewer
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

// ****************************************************************
// Mixcloud API code
// ****************************************************************

//elements
var mixcloudPlayerEl = document.getElementById('mixcloud-player');

// variables
var getMixcloudResults = {};
var arrayMixcloudKeys = [];
// add FEED (Key = /user/mix) from KEY value
var mixcloudPlayUrl = "https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed="


var mixcloudButtonEl = document.getElementById("mx-next-button");


mixcloudButtonEl.addEventListener("click", (event) => {
    loadMixcloudSelection(arrayMixcloudKeys);
});

// mixcloud web fetch
function getMixcloudContent(value) {
    var queryUrl = `https://api.mixcloud.com/discover/${value}/latest/`;

    fetch(queryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            getMixcloudResults = data.data;

            //clear array of video keys to avoid duplications, etc
            arrayMixcloudKeys = [];

            for (var i = 0; i < getMixcloudResults.length; i++) {
                var key = getMixcloudResults[i].key;
                arrayMixcloudKeys.push(key);
            }
            arrayMixcloudKeys = [...arrayMixcloudKeys].sort(() => 0.5 - Math.random());

            // load new Mixcloud selection
            loadMixcloudSelection(arrayMixcloudKeys)
        });
};

function loadMixcloudSelection(arrayOfTracks) {

    // get first element and remove it from the arrayOfTracks
    var track = arrayOfTracks.shift();

    //drop any existing widget from the mixcloudPlayerEl parent
    var currentIFrame = document.getElementById('mx-iframe');
    mixcloudPlayerEl.removeChild(currentIFrame);
    // create new player widget (iframe element)
    var trackUrl = mixcloudPlayUrl + track;
    var widgetId = "mx-iframe";
    var widgetWidth = "100%";
    var widgetHeight = "150";
    var widgetSrc = trackUrl;
    var widgetBorder = "0";
    var widgetIFrame = document.createElement("iframe");
    widgetIFrame.id = widgetId;
    widgetIFrame.width = widgetWidth;
    widgetIFrame.height = widgetHeight;
    widgetIFrame.setAttribute("border", "0");
    widgetIFrame.src = widgetSrc;

    //attach new widget
    mixcloudPlayerEl.append(widgetIFrame);
}



//***********
//Attempted OMDB API fetch, did not function as intended and was removed from final product. Credit: Kellen Kittrell
//***********
// let apiKey = 'efa1cce';
// let happy = 'clueless';
// let e = document.getElementById('title');
// let b = document.getElementById('search');
// let searchFormEl = document.getElementById('search-form');
// function fubar(URL){
// fetch(URL)
//     .then(function (res) {
//         console.log(res.ok);
//        return res.json();
//     })
//     .then(function (data) {
//         console.log('data');
//         console.log(data);
//     });
// }
// searchFormEl.addEventListener("submit", function () {

//     let userInput = e.value;
//     let query = 'http://www.omdbapi.com/?s=' + userInput + '&apikey=efa1cce';
//     fubar(query);
//     console.log(userInput);
//     console.log(query);

// });