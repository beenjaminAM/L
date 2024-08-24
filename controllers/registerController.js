const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required' })
    } 
    
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 12)
        //store the new user
        const newUser = { "username": user, "password": hashedPwd }

        res.status(201).json({'success': `New user ${newUser} created`})
        
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleNewUser }