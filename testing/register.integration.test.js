const { setTimeout } = require('node:timers/promises')

const {
    getAllUsers,
    initialUsers,
    api
} = require('./helpers')

const { server } = require('../server')
const mongoose = require('mongoose')
const User = require('../model/User')

beforeAll(async () => {

    await api.post('/register')
        .send({"user": "user1", "pwd": "user1"})
        .then(data => console.log(data.body))

})

afterAll(async () => {
    
    await User.deleteMany({})
    mongoose.connection.close()
    server.close()

})


it('POST /register with empty body returns 400 Bad Request', async () => {
    const bodyInitials = await getAllUsers()
    const response = await api.post('/register').send({})
    const bodyFinals = await getAllUsers()

    expect(response.statusCode).toBe(400) // Bad Request
    expect(bodyFinals).toHaveLength(bodyInitials.length)
})

it('POST /register with only username returns 400 Bad Request', async () => {
    const bodyInitials = await getAllUsers()
    const response = await api.post('/register').send({
        "user": "tomas"
    })
    const bodyFinals = await getAllUsers()

    expect(response.statusCode).toBe(400) // Bad Request
    expect(bodyFinals).toHaveLength(bodyInitials.length)
})

it('POST /register with only password returns 400 Bad Request', async () => {
    const bodyInitials = await getAllUsers()
    const response = await api.post('/register').send({
        "pwd": "tomas"
    })
    const bodyFinals = await getAllUsers()

    expect(response.statusCode).toBe(400) // Bad Request
    expect(bodyFinals).toHaveLength(bodyInitials.length)
})

it('POST /register with username and password returns 201 Created', async () => {
    const bodyInitials = await getAllUsers()
    const response = await api.post('/register').send({
        "user": "tomas",
        "pwd": "tomas"
    })
    const bodyFinals = await getAllUsers()

    expect(response.statusCode).toBe(201) // Created
    expect(bodyFinals).toHaveLength(bodyInitials.length + 1)
    expect(bodyFinals.map(data => data.username)).toContain('tomas')
})

it('POST /register with duplicated username returns 409 Conflict', async () => {
    const bodyInitials = await getAllUsers()
    const response = await api.post('/register').send({
        "user": "tomas",
        "pwd": "tomas"
    })
    const bodyFinals = await getAllUsers()

    expect(bodyFinals).toHaveLength(bodyInitials.length)
    expect(response.statusCode).toBe(409) // Conflict
})
