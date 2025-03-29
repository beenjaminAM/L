const { api } = require('./helpers')
const mongoose = require('mongoose')
const Employee = require('../model/Employee')
const User = require('../model/User')

const { 
    server
 } = require('../server')

const {
    initialEmployees,
    auxUser
} = require('./helpers')

beforeAll( async () => {
    
    await User.deleteMany()
    await api.post('/register').send(auxUser)

    for (const employee of initialEmployees) { 
        const emploObj = new Employee(employee)
        await emploObj.save()
    }
    
})

afterAll(async () => {

    server.close()
    await Employee.deleteMany()
    await User.deleteMany()
    await mongoose.connection.close()

})

it('Should return 401 Unauthorized for GET, POST, PUT, and DELETE requests without credentials', async () => {

    const resGET = await api.get('/employees')
        //.set('Cookie', ['jwt=cookie']) // Cookie not set
        .send({})
    const resPOST = await api.post('/employees')
        .send({})
    const resPUT = await api.put('/employees')
        .send({})
    const resDEL = await api.delete('/employees')
        .send({})
    
    expect(resGET.statusCode).toBe(401)
    expect(resPOST.statusCode).toBe(401)
    expect(resPUT.statusCode).toBe(401)
    expect(resDEL.statusCode).toBe(401)

})

describe('GET /employees with credentials', () => {

    it('Should return 200 and employee list if employees exist', async () => {

        const authResponse = await api.post('/auth').send(auxUser)

        const resGET = await api.get('/employees')
            .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
            .send()
        
        expect(resGET.statusCode).toBe(200)
        expect(response.body).toHaveLength(initialEmployees.length)
    
    })

})