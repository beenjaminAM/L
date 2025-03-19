const { setTimeout } = require('node:timers/promises')

const {
    auxUser,
    api
} = require('./helpers')

const { server } = require('../server')
const mongoose = require('mongoose')
const User = require('../model/User')

const sleep = () => {
    return setTimeout('10000')
}

beforeAll(async() => {

    await api.post('/register').send(auxUser)

})

afterAll(async () => {

    await User.deleteMany({})
    mongoose.connection.close()
    server.close()

})

it('GET /refresh without a cookie token returns 401 Unauthorized', async () => {

    const authResponse = await api.post('/auth').send(auxUser)
    const cookie = authResponse.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    console.log(cookie)
    const cookie_example = [
        'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJlbmphIiwiaWF0IjoxNzM5MjAwNDUzLCJleHAiOjE3MzkyODY4NTN9.3jUTCzPNQkmoqStPie7fZusEV2jngt30-UAcLDsxa4Q',
        ' 11 Feb 2025 15:14:13 GMT'
    ]
    const refreshRes = await api.get('/refresh')
        //.set('Cookie', cookie) // Cookie not set

    expect(refreshRes.statusCode).toBe(401) // Anauthorized

}, '15000')

it('GET /refresh with a different JWT cookie token returns 401 Unauthorized', async () => {

    const authResponse = await api.post('/auth').send(auxUser)
    const cookie = authResponse.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    const refreshRes = await api.get('/refresh')
        .set('Cookie', ['nojwt=cookie']) // Incorrect Cookie

    expect(refreshRes.statusCode).toBe(401) // Anauthorized

}, '15000')
  
it('GET /refresh with an invalid JWT cookie token returns 403 Forbidden', async () => {

    const authResponse = await api.post('/auth').send(auxUser)
    const cookie = authResponse.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    const refreshRes = await api.get('/refresh')
        .set('Cookie', ['jwt=cookie']) // Incorrect Cookie

    expect(refreshRes.statusCode).toBe(403) // Forbidden

}, '15000')

it('GET /refresh with an expired JWT cookie token returns 403 Forbidden', async () => {

    const authResponse = await api.post('/auth').send(auxUser)
    const cookie = authResponse.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    await sleep() // 10 Seconds. For Test Porpuses  Refresh Token Cookie expires in 1 second, in produccion expires in 1d
    const refreshRes = await api.get('/refresh')
        .set('Cookie', cookie) // Incorrect Cookie
    expect(refreshRes.statusCode).toBe(403) // Forbidden

}, '15000')

it('GET /refresh with a valid JWT cookie token returns 200 OK', async () => {

    const authResponse = await api.post('/auth').send(auxUser)
    const cookie = authResponse.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    const refreshRes = await api.get('/refresh')
        .set('Cookie', cookie) // Correct Cookie
    expect(refreshRes.statusCode).toBe(200) // OK

}, '5000')
  

/*
it('/employees with Authorization Token expired return 403 Forbiden', async () => {

    const register = await api.post('/register').send(auxUser)
    const authResponse = await api.post('/auth').send(auxUser)
    const cookie = authResponse.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    const refreshRes = await api.get('/refresh')
        .set('Cookie', cookie) // Refresh Working Great

    await sleep() // 5 Seconds
    
    console.log('Past 5 seconds')

    // Access JWT Timeout
    const { statusCode } = await api.get('/employees')
        .set('Authorization', `Bearer ${refreshRes.body.accessToken}`)
        .send()

    expect(statusCode).toBe(403) // Forbidden

}, '15000')
  */