const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog
            .find({})
            .populate('user', { username: 1, name: 1})
        return response.json(blogs)
    } catch (e) {
        next(e)
    }
})

blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blogPost = await Blog.findById(request.params.id)
        if (blogPost) {
            response.json(blogPost)
        } else {
            response.status(404).end()
        }
    } catch (e) {
        next(e)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body

        if (!body.title) {
            return response.status(400).end()
        }

        if (!body.url) {
            return response.status(400).end()
        }

        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid'})
        }

        const user = await User.findById(decodedToken.id)

        const newBlogPost = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes != undefined ? body.likes : 0,
            user: user
        })

        const savedBlogPost = await newBlogPost.save()
        user.blogs = user.blogs.concat(savedBlogPost._id)
        await user.save()

        response.status(201).json(savedBlogPost)

    } catch (e) {
        next(e)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid'})
        }

        const params = request.params

        const blog = await Blog.findById(params.id)
        if (blog.user.toString() !== decodedToken.id.toString()) {
            return response.status(401).json({ error: 'token missing or invalid'})
        }

        await Blog.findByIdAndRemove(params.id)
        response.status(204).end()
    } catch (e) {
        next(e)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const body = request.body

        const existing = await Blog.findById(request.params.id)
        const updated = {
            title: existing.title,
            author: existing.author,
            url: existing.url,
            likes: body.likes
        }

        const updatedResponse = await existing.updateOne(updated)
        response.json(updatedResponse)

    } catch (e) {
        next(e)
    }
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
    try {
        const existing = await Blog.findById(request.params.id)
        if (!existing) {
            return response.status(404).end()
        }

        const body = request.body
        if (!body.content) {
            return response.status(400).end()
        }

        const updated = {
            ...existing.toObject(),
            comments: [
                ...existing.comments,
                body.content
            ]
        }

        const updatedResponse = await existing.updateOne(updated)
        response.status(201).json(updatedResponse)

    } catch (e) {
        next(e)
    }
})

module.exports = blogsRouter