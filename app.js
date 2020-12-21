//https://benfrain.com/html-templating-with-vanilla-javascript-es2015-template-literals/

const rootDiv = document.getElementById('root');

(window.init = async function init() {
    // set the inner html of the index(home) page
    rootDiv.innerHTML = await load_posts('data/site_data.json')
    addMaps(rootDiv.innerHTML)
})()
//this function coordinates all others, similar to a main
async function load_posts(contentData, parentNode) {
    //load and parse the json
    var JSONContent = await getFile(contentData)
        // console.log(`OBJECT CONTENT: ${objectContent}`)
    postsHTML = htmlBuilder(JSONContent)
        // console.log(postsHTML)
    return postsHTML
        // rootDiv.innerHTML = HTMLTemplate
        // templateHandler("firstTemplate", objectContent)
}

//this function loops through the posts and generates html for each and appends that html to the page
function htmlBuilder(JSONContent) {
    parsedJSON = JSON.parse(JSONContent)
    let postsHTML = ""
    for (var prop in parsedJSON.Posts) {
        // console.log(`KEY:  ${prop} VALUE:${objectContent.Posts[prop]}`)
        postsHTML = postsHTML + createPost(prop, parsedJSON.Posts[prop])
    }
    return postsHTML
}

//add maps
function addMaps() {
    mapElements = document.getElementsByClassName("map")
        // console.log(mapElements)
    for (var prop in mapElements) {
        // console.log(`prop ${prop} Var ${prop}`)
        // console.log(mapElements[prop])
        try {
            // console.log(mapElements[prop].id)
            if (mapElements[prop].id !== "undefined") {
                addMap(`TESTING`, mapElements[prop].id)
            } else {
                console.log(`unable to find map attribute for post in json file. Removing map element: ${(mapElements[prop].id)}`)
                    (mapElements[prop].id).remove()
            }
        } catch (e) {
            console.log(e)
        }
    }
}


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



function createPost(idx, dataRecord) {
    //fix the date
    var departureDate = new Date(dataRecord.Departure)
    var arrivalDate = new Date(dataRecord.Arrival)
        /*html*/
    var returnStringWithMap = `
    <div class="post-wrapper ${idx}">
    <h1 class="a-Series_Title">${dataRecord.Title}</h1>
    <h3> ${dataRecord.Subtitle}</h3>
    <h3><b> Departure Date:</b> ${departureDate}, ${dataRecord.Departure_Port}  </h3>
    <h3><b> Arrival Date:</b> ${arrivalDate}, ${dataRecord.Arrival_Port}</h3>
    <h3> <b> Engine Run Time:</b>${dataRecord.Diesel_Run_Time}</h3>
    <p><b> Notes:</b> ${dataRecord.Notes}</p>
    <div class="map ${idx}" id=${dataRecord.Mapid}></div>
    </div>
    `
        /*html*/
    var returnStringNoMap = `
    <div class='post-wrapper'>
    <h1 class="a-Series_Title">${dataRecord.Title}</h1>
    <h3> ${dataRecord.Subtitle}</h3>
    <h3><b> Departure Date:</b> ${departureDate}, ${dataRecord.Departure_Port}  </h3>
    <h3><b> Arrival Date:</b> ${arrivalDate}, ${dataRecord.Arrival_Port}</h3>
    <h3> <b> Engine Run Time:</b> ${dataRecord.Diesel_Run_Time}</h3>
    <p><b> Notes:</b> ${dataRecord.Notes}</p>
    </div>
    `
    if (typeof(dataRecord.Mapid) !== 'undefined') {
        return returnStringWithMap
    } else {
        return returnStringNoMap
    }
}


function addMap(mapname, mapid) {
    console.log((mapid[0]))
        // for (i in mapid) {
        //     console.log(mapid[i])
        // }
    var mapname = L.map(mapid)

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoiZXRoYW5tZXJyaWxsIiwiYSI6ImNrYzN2MW4xZDAxcTgyenBtOHZvam04dTkifQ.GjfZ0jTltvrcjVKMUv5CNQ",
        crossOrigin: "samesite",
        // x: 1,
        // y: 1,
        // z: 1
    }).addTo(mapname)
    console.log(`data/${mapid}`)
    var gpx = `data/${mapid}`; // URL to your GPX file or the GPX itself
    var runLayer = omnivore.gpx(gpx)
        .on('ready', function() {
            mapname.fitBounds(runLayer.getBounds());
        })
        .addTo(mapname);
    return [mapname, mapid]
}