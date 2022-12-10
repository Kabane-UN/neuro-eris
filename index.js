const express = require('express')
const app = express()
const port = 8099
const host = '127.0.0.1'

app.set('view options', {layout: false});
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index.html')
})

app.listen(port, host)
