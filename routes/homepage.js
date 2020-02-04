var express = require('express')
var router = express.Router()

// Homepage
router.get('/', function(req, res){
    var data_file = req.app.locals.mock_data_file
    const csvFilePath='./public/csv/' + data_file
    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((data_content)=>{
            var data_title = req.app.locals.mock_data_title
            var field_list = req.app.locals.mock_field_list
            res.render('home', {
                data_title: data_title,
                field_list: field_list,
                data_content: data_content
            })
        })
})
module.exports = router
