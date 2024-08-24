require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3500

//built-in middleware for json
app.use(express.json())

app.use('/register', require('./routes/register'))

app.all('*', (req, res) => {
    res.status(404).json({ "error": "404 Not Found"})
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

