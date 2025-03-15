const { setTimeout } = require('node:timers/promises')

const {
    initialEmployees,
    auxUser,
    api
} = require('./helpers')

const { server } = require('../serverModel')
const mongoose = require('mongoose')
const User = require('../model/User')
const Employee = require('../model/Employee')

const sleep = () => {
    return setTimeout('5000')
}

beforeAll(async () => {

    await api.post('/register').send(auxUser)

    for (const employee of initialEmployees) { 
        const emploObj = new Employee(employee)
        await emploObj.save()
    }
    await api.post('/register').send(auxUser)

})

afterAll(async () => {
    await User.deleteMany({})
    mongoose.connection.close()
    server.close()

})


it('Accessing private resource without Authorization returns 401 Unauthorized', async () => {

    const authResponse = await api.post('/auth').send(auxUser)

    // No Authorization provided
    const { statusCode } = await api.get('/employees').send()
        //.set('Authorization', `Bearer ${refreshRes.body.accessToken}`)

    expect(statusCode).toBe(401) // Anauthorized

}, '1000')

it('Accessing private resource with incorrect Authorization returns 403 Forbidden', async () => {

    const authResponse = await api.post('/auth').send(auxUser)

    // No Authorization provided
    const { statusCode } = await api.get('/employees')
        .set('Authorization', `Bearer ${"incorrectToken"}`)
        .send()

    expect(statusCode).toBe(403) // Forrbiden

}, '1000')

it('AAccessing private resource with expired Authorization returns 403 Forbidden', async () => {

    const authResponse = await api.post('/auth').send(auxUser)

    await sleep() // 5 Seconds
    
    // Access JWT Timeout
    const { statusCode } = await api.get('/employees')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send()

    expect(statusCode).toBe(403) // Forbidden

}, '7000')  

it('Accessing private resource with valid Authorization returns 200 OK', async () => {

    const authResponse = await api.post('/auth').send(auxUser)
    
    // Access JWT Timeout
    const { statusCode } = await api.get('/employees')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send()

    expect(statusCode).toBe(200) // Ok

}, '1000')
  

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