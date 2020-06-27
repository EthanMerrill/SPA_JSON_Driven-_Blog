//https://benfrain.com/html-templating-with-vanilla-javascript-es2015-template-literals/

const rootDiv = document.getElementById('root');

(window.init = async function init() {
    // set the inner html of the index(home) page
    rootDiv.innerHTML = await load_posts('data/site_data.json')
})()
//this function coordinates all others, similar to a main
async function load_posts(contentData, parentNode) {
    //load and parse the json
    var JSONContent = await getFile(contentData)
    var objectContent = JSON.parse(JSONContent)
        // console.log(`OBJECT CONTENT: ${objectContent}`)
    postsHTML = htmlBuilder(objectContent)
        // console.log(postsHTML)

    return postsHTML
        // rootDiv.innerHTML = HTMLTemplate
        // templateHandler("firstTemplate", objectContent)
}

//this function loops through the posts and generates html for each and appends that html to the page
function htmlBuilder(objectContent) {
    let postsHTML = ""
    for (var prop in objectContent.Posts) {
        // console.log(`KEY:  ${prop} VALUE:${objectContent.Posts[prop]}`)
        postsHTML = postsHTML + createPost(objectContent.Posts[prop])
    }
    return postsHTML
}

//Complete date plus hours and minutes:
// YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)

// function to get json files as a js object. the argument is the filename in string type
// this function is designed to work on a server or locally
async function getFile(fileName) {
    // console.log(`GET FILE Getting: ${fileName}`)
    try {
        // console.log("try 1")
        let response = await fetch(fileName)
        let data = await response.text()
            // console.log(`DATA Returning: ${data}`)
        return data
    } catch (error) {
        console.error(error)
    }
    try {
        // console.log("try 2")
        fetch(fileName, { mode: 'no-cors' })
            .then(response => response.text())
            .then(data => console.log(data))
        return data
    } catch (error) {
        console.error(error)
    }
}

// This function takes the data and information on where to put it to inject the Data into the HTML Page
// function templateHandler(scriptID, contentDataJSON) {
//     console.log(scriptID, wrapperID, contentDataJSON)
//     var theScriptHTML = document.getElementById(scriptID).innerHTML
//     var theTemplate = Handlebars.compile(theScriptHTML)
//     var contextObj = (contentDataJSON)
//     var compiledData = theTemplate(contextObj)

//     document.getElementById(wrapperID).innerHTML = compiledData
// }

function createPost(dataRecord) {
    //fix the date
    var departureDate = new Date(dataRecord.Departure)
    var arrivalDate = new Date(dataRecord.Arrival)
        /*html*/
    var returnString = `
    <h1 class="a-Series_Title">${dataRecord.Title}</h1>
    <h3> ${dataRecord.Subtitle}</h3>
    <h3> ${dataRecord.Tags}</h3>
    <h3> ${dataRecord.ArticleType}</h3>
    <h3> ${departureDate}</h3>
    <h3> ${arrivalDate}</h3>
    <h3> ${dataRecord.Diesel_Run_Time}</h3>
    <p> ${dataRecord.Notes}</p>
    `
    return returnString

}

// map rendering functions
// https://github.com/mpetazzoni/leaflet-gpx

// var map = L.map('mapid');
// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
// }).addTo(map);

var mymap = L.map('mapid').setView([51.505, -0.09], 13);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoiZXRoYW5tZXJyaWxsIiwiYSI6ImNrYnY2Z253ejAwb2kzMnMwaXBka3V5YngifQ.oj7CpA3D3Rlu9yxGFDN_iw",
    crossOrigin: "samesite"
}).addTo(mymap)

var gpx = 'data/Navionics_archive_export.gpx'; // URL to your GPX file or the GPX itself
var runLayer = omnivore.gpx(gpx)
    .on('ready', function() {
        mymap.fitBounds(runLayer.getBounds());
    })
    .addTo(mymap);


// var overlay = new JNC.Leaflet.NavionicsOverlay({
// navKey: 'navionics_key',
// chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
// isTransparent: true,
// // Enable Navionics logo with payoff
// logoPayoff: true,
// zIndex: 1
// }));
// map.setView([36.140751, -5.353585], 14);
// overlay.addTo(map);