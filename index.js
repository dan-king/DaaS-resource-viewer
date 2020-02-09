var express = require('express')
var config = require('./config.json')
var app = express()
app.set('port', config.port || 3000)
app.set('env', config.env || 'development')
// Allow self-signed certs in development
if (app.get('env') == 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}
var server = app.listen(app.get('port'), function () {
    console.log('Listening on port %s.', server.address().port)
    console.log('Website live at http://localhost:' + app.get('port') + '/')
    console.log('Press Ctrl-C to terminate.')
})

// ===============================================
// Path to npm packages
// ===============================================
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) // redirect bootstrap CSS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')) // redirect JS jQuery
app.use('/bs', express.static(__dirname + '/node_modules/bootstrap/dist/js')) // redirect bootstrap JS

app.use('/datatables', express.static(__dirname + '/node_modules/datatables.net/js'))
app.use('/datatables_bs4', express.static(__dirname + '/node_modules/datatables.net-bs4'))



// ===============================================
// Define static public directory
// ===============================================
app.use(express.static(__dirname + '/public'))

// ===============================================
// Set mock data
// ===============================================
app.locals.mock_data_file = config.mock_data_file
app.locals.mock_data_title = config.mock_data_title
app.locals.mock_field_list = config.mock_field_list
app.locals.ckan_resource_id = config.ckan_resource_id
app.locals.ckan_token = config.ckan_token
app.locals.wso2_token = config.wso2_token

// ===============================================
// Set page title
// ===============================================
app.locals.copyrightYear = new Date().getFullYear()
app.locals.pageTitle = config.pageTitle || 'Page Title'

// ===============================================
// Set copyright
// ===============================================
app.locals.copyrightYear = new Date().getFullYear()
app.locals.copyrightMessage = config.copyright || 'Copyright'

// ===============================================
// Use favicon
// ===============================================
var favicon = require('serve-favicon')
var path = require('path')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// ===============================================
// Use 'body-parser' to enable reading of POST requests
// in req.body
// ===============================================
app.use(require('body-parser').urlencoded({extended: true}))

// ===============================================
// Set up Handlebars view engine
// ===============================================
var handlebars = require('express-handlebars').create({ defaultLayout:'main' })
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

var hb = require('handlebars')

// Register JSON helper
// See also http://zshawnsyed.com/2015/04/30/output-json-in-handlebars/
// See also https://stackoverflow.com/questions/10232574/handlebars-js-parse-object-instead-of-object-object
hb.registerHelper('json', function(context) {
    return JSON.stringify(context)
})

// ===============================================
// Define routes
// ===============================================

// Home
app.get('/', function(req, res){
    res.redirect(303, '/home')
})
var homepage = require('./routes/homepage')
app.use('/home', homepage)

//
// Special routes if page not found or an error occurred
//

// Error page
app.get('/error', function(req, res){
    var err = req.query.err
    res.render('error', {
        err: err
    })
})

// Custom 404 page
app.use(function(req, res){
    res.status(404)
    res.render('404')
})

// Custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack)
    res.status(500)
    res.render('500')
})

//readJsonFile()
function readJsonFile() {
    console.log('BEGIN readJsonFile')
    //const fs = require('fs')
    const filepath = './json/starbucks10.json'

    const jsonfile = require(filepath)
    console.log('jsonfile:', jsonfile) 

    console.log("*************************************")

    var payload = jsonfile.result.records
    console.log('payload:', payload) 


    console.log("*************************************")
    // fs.readFile(filepath, function(err, data) {
    //     if (err) { 
    //         console.log('err:', err) 
    //     } else {
    //         console.log('data:', data) 
    //     }
    // })
    console.log('END readJsonFile')
}

//getCSVFileFromInternet()
function getCSVFileFromInternet() {
    console.log('BEGIN getCSVFileFromInternet')
    const fs = require('fs')
    var request = require('request')

    var url = 'https://www.stats.govt.nz/assets/Uploads/National-population-estimates/National-population-estimates-At-30-June-2018/Download-data/national-population-estimates-at-30-june-2018-components-of-population-change-csv.csv'

    const options = {
        url: url,
        method: 'GET',
        timeout: 5500
    }

    request(options, (err, response, body) => {
        console.log('response.statusCode:', response.statusCode)
        if (err) { 
            console.log('err:', err) 
        } else if (body) {
            console.log('body:', body) 
            fs.writeFile('./public/csv/starbucks.csv', body, function(err) {
                if (err) {
                    return console.log(err)
                }
                console.log('The file was saved!')
            })
        } else {
            console.log('Error: body not defined') 
        }
    })

    console.log('END getCSVFileFromInternet')
}

//getJsonFileFromInternet()
function getJsonFileFromInternet() {
    console.log('BEGIN getJsonFileFromInternet')
    const fs = require('fs')
    var request = require('request')

    var url = 'https://daas07.sfgov.org:8243/daas_prod/3.0.1/action/datastore_search?resource_id=' + config.ckan_resource_id + '&q=STARBUCKS&limit=1000'

    const options = {
        url: url,
        method: 'GET',
        timeout: 5500,
        headers: {
            Authorization : 'Bearer ' + config.wso2_token,
            'X-CKAN-API-Key' : config.ckan_token
        }
    }

    request(options, (err, response, body) => {
        console.log('response.statusCode:', response.statusCode)
        if (err) { 
            console.log('err:', err) 
        } else if (body) {
            console.log('body:', body) 
            fs.writeFile('./json/starbucks.json', body, function(err) {
                if (err) {
                    return console.log(err)
                }
                console.log('The file was saved!')
            })
        } else {
            console.log('Error: body not defined') 
        }
    })

    console.log('END getJsonFileFromInternet')
}