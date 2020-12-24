const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialUsers = [
    {
        name: "Name 1",
        username: "username1",
        password: "password1"
    },
    {
        name: "Name 2",
        username: "username2",
        password: "password2"
    },
    {
        name: "Name 3",
        username: "username3",
        password: "password3"
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

beforeEach(async () => {
    await User.deleteMany({})

    for (const user of initialUsers) {
        const newUser = new User({
            username: user.username,
            passwordHash: await bcrypt.hash(user.password, 10),
            name: user.name,
        })
        await newUser.save()
    }
})

test('invalid users are not created and returns error', async () => {
    const result = await api
        .post('/api/users')
        .send({
            password: 'foo',
            name: 'Name'
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('required')

    const users = await usersInDb()
    expect(users).toHaveLength(initialUsers.length)
})

afterAll(() => {
    mongoose.connection.close()
})
