const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()


app.use(cors())
app.use(express.static('./dist/program-coder'))
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, '/dist/program-coder/indext.html'))
})

app.listen(process.env.PORT ||8080, ()=>{
    console.log('Server started')
})