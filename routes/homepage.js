var express = require('express')
var router = express.Router()

// Homepage
router.get('/', function(req, res){
    var message = 'Hello World'

    var data_title = req.app.locals.mock_data_title
    var data_content = req.app.locals.mock_data_content

    res.render('home', {
        message: message,
        data_title: data_title,
        data_content: data_content
    })
})
module.exports = router
