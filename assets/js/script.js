let apiKey = 'efa1cce';
let happy = 'clueless';
let e = document.getElementById('title');
let b = document.getElementById('search');
let searchFormEl = document.getElementById('search-form');
function fubar(URL){
fetch(URL)
    .then(function (res) {
        console.log(res.ok);
       return res.json();
    })
    .then(function (data) {
        console.log('data');
        console.log(data);
    });
}
searchFormEl.addEventListener("submit", function () {

    let userInput = e.value;
    let query = 'http://www.omdbapi.com/?s=' + userInput + '&apikey=efa1cce';
    // let queryURL = "https://api.github.com/repos/nodejs/node/issues?per_page=5";
    fubar(query);
    console.log(userInput);
    console.log(query);

});
// fubar();

// for (i = 0; i > happy.length; i++) {
//     console.log(happy);
// }