var express = require('express')
var router = express.Router()

// Homepage
router.get('/', function(req, res){
    const csvFilePath='./public/csv/mock.csv'
    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((data_content)=>{
            var data_title = req.app.locals.mock_data_title
            //data_content = req.app.locals.mock_data_content
            res.render('home', {
                data_title: data_title,
                data_content: data_content
            })
        })

})
module.exports = router
