const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Title 1",
        author: "Author 1",
        url: "URL1",
        likes: 0
    },
    {

        title: "Title 2",
        author: "Author 2",
        url: "URL2",
        likes: 1

    },
    {
        title: "Title 3",
        author: "Author 3",
        url: "URL3",
        likes: 2
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ content: 'dummy'})
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let eachBlog of initialBlogs) {
        const blog = new Blog(eachBlog)
        await blog.save()
    }
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)
        .expect(200)
})

test('correct number of blogs are returned', async () => {
    const blogs = await blogsInDb()

    expect(blogs).toHaveLength(initialBlogs.length)
})

test('blog post has friendly id property', async () => {
    const blogs = await blogsInDb()

    for (const blog of blogs) {
        expect(blog.id).toBeDefined()
    }
})

// test('can add new blog posts', async () => {
//     const newPost = {
//         title: "New Title",
//         author: "New Author",
//         url: "NewURL",
//         likes: 1
//     }

//     await api.post('/api/blogs')
//         .send(newPost)
//         .expect(201)

//     const newBlogs = await blogsInDb()
    
//     expect(newBlogs).toHaveLength(initialBlogs.length + 1)

//     newBlogs.forEach(b => delete b.id)
//     expect(newBlogs).toContainEqual(newPost)
// })

// test('likes default to 0 if not present', async () => {
//     const newPost = {
//         title: "New Title no like",
//         author: "New Author no like",
//         url: "NewURLNoLike",
//     }

//     const savedPost = await api.post('/api/blogs').send(newPost)
//     expect(savedPost.body.likes).toEqual(0)
// })

// test('bad data', async () => {
//     const noUrl = {
//         title: "New Title",
//         author: "New Author",
//     }

//     await api.post('/api/blogs')
//         .send(noUrl)
//         .expect(400)

//     const noTitle = {
//         author: "New Author",
//         url: "NewURL",
//     }

//     await api.post('/api/blogs')
//         .send(noUrl)
//         .expect(400)
// })

afterAll(() => {
    mongoose.connection.close()
})
