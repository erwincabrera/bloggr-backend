const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const blogs = [
    {
        title: 'A',
        author: 'A',
        url: 'A',
        likes: 0
    },
    {
        title: 'B',
        author: 'B',
        url: 'B',
        likes: 2
    },
    {
        title: 'C',
        author: 'C',
        url: 'C',
        likes: 3
    },
    {
        title: 'A2',
        author: 'A',
        url: 'A2',
        likes: 0
    }
]

describe('total likes', () => {
    test('empty blogs return 0', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
    test('5 likes', () => {
        expect(listHelper.totalLikes(blogs)).toBe(5)
    })
})

describe('favorite blog', () => {
    test('top', () => {
        expect(listHelper.favoriteBlog(blogs)).toBe(blogs[2])
    })
})

describe('most blogs', () => {
    test('most', () => {
        expect(listHelper.mostBlogs(blogs)).toStrictEqual({
            author: 'A',
            blogs: 2
        })
    })
})

describe('most likes', () => {
    test('most', () => {
        expect(listHelper.mostLikes(blogs)).toStrictEqual({
            author: 'C',
            likes: 3
        })
    })
})