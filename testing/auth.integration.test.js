const {
    api
} = require('./helpers')

const { server } = require('../serverModel')
const mongoose = require('mongoose')
const User = require('../model/User')

beforeAll(async () => {

    await api.post('/register')
        .send({"user": "user1", "pwd": "user1"})
})


afterAll(async () => {
    
    await User.deleteMany({})
    mongoose.connection.close()
    server.close()

})


it('POST /auth with empty body return 400 Bad Request', async () => {

    const response = await api.post('/auth').send({
    })
    
    expect(response.statusCode).toBe(400) // Bad Request
    expect(response.body.accessToken).toBe(undefined)
    expect(response.headers).not.toHaveProperty('set-cookie')    

})

it('POST /auth with only user return 400 Bad Request', async () => {
    
    const response = await api.post('/auth').send({
        "user": "user1"
    })
    
    expect(response.statusCode).toBe(400) // Bad Request
    expect(response.body.accessToken).toBe(undefined)
    expect(response.headers).not.toHaveProperty('set-cookie')    

})


it('POST /auth with only pwd return 400 Bad Request', async () => {

    const response = await api.post('/auth').send({
        "pwd": "user1"
    })
    
    expect(response.statusCode).toBe(400) // Bad Request
    expect(response.body.accessToken).toBe(undefined)
    expect(response.headers).not.toHaveProperty('set-cookie')    

})

it('POST /auth with incorrect user and pwd return 401 Anaythorized', async () => {

    const response = await api.post('/auth').send({
        "user": "user2",
        "pwd": "user1"
    })
    
    expect(response.statusCode).toBe(401) // Bad Request
    expect(response.body.accessToken).toBe(undefined)
    expect(response.headers).not.toHaveProperty('set-cookie')    

})

it('POST /auth with correct user and pwd return 200 Ok', async () => {

    const response = await api.post('/auth').send({
        "user": "user1",
        "pwd": "user1"
    })
    
    expect(response.statusCode).toBe(200) // Bad Request
    expect(response.body.accessToken).not.toBe(undefined)
    expect(response.headers).toHaveProperty('set-cookie')    

})