require('dotenv').config()

const { app } = require('../server')
const supertest = require('supertest')
const User = require('../model/User')


const api = new supertest(app)

const initialUsers = 
    [
        {
            user: 'tomas',
            pwd: "tomas"
        }
    ]

async function getAllUsers() {
    
    const users = await User.find()

    return users
}

auxUser = {
    user: 'tomas',
    pwd: "tomas"
}

module.exports = {
    api,
    initialUsers,
    getAllUsers,
    auxUser
}


