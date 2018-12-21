const express = require('express')
const path = require('path')
const app = express()

app.use(express.static('./dist/program-coder'))
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, '/dist/program-coder/indext.html'))
})

app.listen(8080, ()=>{
    console.log('Server started')
})