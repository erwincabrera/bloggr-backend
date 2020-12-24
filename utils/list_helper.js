const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(b => b.likes)
    const fav = likes.indexOf(Math.max(...likes))
    return blogs[fav]
}

const mostBlogs = (blogs) => {
    const count = blogs.map(eachBlog => {
        return blogs.reduce((count, currBlog) =>
            currBlog.author === eachBlog.author ? count + 1 : count
            , 0)
    })
    const maxCount = Math.max(...count)
    const maxCountInd = count.indexOf(maxCount)
    return {
        author: blogs[maxCountInd].author,
        blogs: maxCount
    }
}

const mostLikes = (blogs) => {
    const likes = blogs.map(eachBlog => {
        return blogs.reduce((likes, currBlog) =>
            currBlog.author === eachBlog.author ? likes + currBlog.likes : likes,
            0)
    })
    const maxLikes = Math.max(...likes)
    const maxLikesInd = likes.indexOf(maxLikes)
    return {
        author: blogs[maxLikesInd].author,
        likes: maxLikes
    }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}