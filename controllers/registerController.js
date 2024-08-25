const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required' })
    }

    //check for duplicate usernames in DB
    const duplicate = await User.findOne({ username: user }).exec()
    if (duplicate) return res.sendStatus(409) //Conflict
    
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 12)
        
        const forceError = null
        forceError.toString() 

        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd,
        })
        console.log(result)

        res.status(201).json({'success': `New user ${user} created`})
        
    } catch (err) {
        res.status(500).json({ 'handleNewUser': err.message })
    }
}

module.exports = { handleNewUser }