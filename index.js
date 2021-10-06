const express = require('express')
const app = express()
require("dotenv").config();
const port = process.env.PORT
const bodyParser = require("body-parser");

const v1 = require("./routes/v1");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/v1", v1);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})