const {Router} = require('express');
const blogController = require('../controllers/blogController');
const blogRouter = Router();

blogRouter.get('/add',blogController.getAddBlogPage);
blogRouter.post('/add',blogController.addBlog);

blogRouter.post('/delete',blogController.deleteBlog);



module.exports = blogRouter;