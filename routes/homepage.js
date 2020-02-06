var express = require('express')
var router = express.Router()

// Homepage
router.get('/', function(req, res){
    var data_content = readJsonFile()
    var data_title = req.app.locals.mock_data_title
    var field_list = req.app.locals.mock_field_list
    res.render('home', {
        data_title: data_title,
        field_list: field_list,
        data_content: data_content
    })

    // var data_file = req.app.locals.mock_data_file
    // const csvFilePath='./public/csv/' + data_file
    // const csv=require('csvtojson')
    // csv()
    //     .fromFile(csvFilePath)
    //     .then((data_content)=>{
    //         var data_title = req.app.locals.mock_data_title
    //         var field_list = req.app.locals.mock_field_list
    //         res.render('home', {
    //             data_title: data_title,
    //             field_list: field_list,
    //             payload: payload,
    //             data_content: data_content
    //         })
    //     })
})

function readJsonFile() {
    console.log('BEGIN readJsonFile')
    const filepath = '../json/starbucks.json'
    const jsonfile = require(filepath)
    var payload = jsonfile.result.records
    console.log('END readJsonFile')
    return payload
}

function getCSVFileFromInternet() {
    const fs = require('fs')
    console.log('BEGIN getCSVFileFromInternet')
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
            console.log('body:', 'body') 
            fs.writeFile('./public/csv/nz.csv', body, function(err) {
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

module.exports = router
