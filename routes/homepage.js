var express = require('express')
var router = express.Router()

// Homepage
router.get('/', function(req, res){
    var message = 'Hello World'
    res.render('home', {
        message: message
    })
})
module.exports = router
