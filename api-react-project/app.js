const express = require('express');
const app = express();
const cors = require('cors');
const authLogic = require('./authLogic');
const postLogic = require('./postLogic');
const likeLogic = require('./likeLogic');

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

// Đăng ký
app.post('/register', (req, res) => {
    const { username, password, dob, image } = req.body;
    const result = authLogic.register(username, password, dob, image);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

// Đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt with username: ${username}`); // Logging
    const result = authLogic.login(username, password);
    console.log(result); // Logging kết quả
    if (result.success) {
        res.json(result);
    } else {
        res.status(401).json(result);
    }
});

// Quản lý bài viết
app.post('/posts', (req, res) => {
    const { title, content, username, status, type } = req.body;
    const newPost = postLogic.createPost(title, content, username, status, type);
    res.json(newPost);
});

app.get('/posts', (req, res) => {
    res.json(postLogic.getPosts());
});

app.get('/likes', (req, res) => {
    res.json(likeLogic.getLikes());
});

app.get('/posts/:id', (req, res) => {
    const post = postLogic.getPostById(+req.params.id);
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

app.put('/posts/:id', (req, res) => {
    const { username } = req.body; // Người dùng hiện tại
    const updatedPost = postLogic.updatePost(+req.params.id, req.body, username);
    if (updatedPost) {
        res.json(updatedPost);
    } else {
        res.status(404).json({ message: 'Post not found or permission denied' });
    }
});

app.delete('/posts/:id', (req, res) => {
    const { username } = req.body; // Người dùng hiện tại
    const deletedPost = postLogic.deletePost(+req.params.id, username);
    if (deletedPost) {
        res.json({ message: 'Post deleted' });
    } else {
        res.status(404).json({ message: 'Post not found or permission denied' });
    }
});

// Like bài viết
app.post('/posts/:id/like', (req, res) => {
    const { username } = req.body;
    const result = likeLogic.likePost(+req.params.id, username);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

// Unlike bài viết
app.post('/posts/:id/unlike', (req, res) => {
    const { username } = req.body;
    const result = likeLogic.unlikePost(+req.params.id, username);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

app.get('/posts/:id/likes', (req, res) => {
    const likes = likeLogic.getLikesByPost(+req.params.id);
    res.json(likes);
});

app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Tìm kiếm bài viết theo từ khóa
app.get('/posts/search', (req, res) => {
    const { keyword } = req.query; // Lấy từ khóa tìm kiếm từ query params
    // Kiểm tra xem từ khóa có tồn tại không
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required.' });
    }
    const searchResult = postLogic.searchPosts(keyword);
    // Kiểm tra xem có kết quả nào không
    if (searchResult.length === 0) {
        return res.status(404).json({ message: 'No results found.' });
    }
    res.json(searchResult);
});

