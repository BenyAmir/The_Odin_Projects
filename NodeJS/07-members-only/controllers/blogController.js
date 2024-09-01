const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { addBlog ,deleteBlog } = require("../model/query");

const validateAddBlogForm = [
  body("title").trim().notEmpty().bail(),
  body("body").trim().notEmpty().bail(),
];

exports.addBlog = [
  validateAddBlogForm,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("new-blog", {
        errors: errors.array(),
      });
    }
    
    // req.body.writer_id = req.session.passport.id;
    req.body.writer_id = req.user.id;
    req.body.created = new Date();
    await addBlog(req.body);    
    res.redirect("/");
  }),
];

exports.getAddBlogPage = asyncHandler(async (req,res,next)=>{
  res.render('new-blog')
})

exports.deleteBlog = asyncHandler(async (req,res,next)=>{
  await deleteBlog(req.query.id);
  res.json({redirect:'/'});
})

