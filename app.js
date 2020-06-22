//https://benfrain.com/html-templating-with-vanilla-javascript-es2015-template-literals/

const rootDiv = document.getElementById('root');

(window.init = async function init() {
    // set the inner html of the index(home) page
    rootDiv.innerHTML = await load_posts('/data/site_data.json')
})()

async function load_posts(contentData) {
    var JSONContent = await getFile(contentData)
    var objectContent = JSON.parse(JSONContent)
    console.log(`JSONCONTENT: ${objectContent.Posts[1].Title}`)
    return createPost(objectContent.Posts[1])
        // rootDiv.innerHTML = HTMLTemplate
        // templateHandler("firstTemplate", objectContent)
}

// function to get json files as a js object. the argument is the filename in string type
// this function is designed to work on a server or locally
async function getFile(fileName) {
    console.log(`GET FILE Getting: ${fileName}`)
    try {
        console.log("try 1")
        let response = await fetch(fileName)
        let data = await response.text()
        console.log(`DATA Returning: ${data}`)
        return data
    } catch (error) {
        console.error(error)
    }
    try {
        console.log("try 2")
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
    /*html*/
    var returnString = `
    <h1 class="a-Series_Title">${dataRecord.title}</h1>
    <h3> ${dataRecord.Subtitle}</h3>
    <h3> ${dataRecord.Tags}</h3>
    <h3> ${dataRecord.ArticleType}</h3>
    <h3> ${dataRecord.Departure}</h3>
    <h3> ${dataRecord.Arrival}</h3>
    <h3> ${dataRecord.Diesel_Run_Time}</h3>
    <p> ${dataRecord.Notes}</p>
    `

    return returnString

}