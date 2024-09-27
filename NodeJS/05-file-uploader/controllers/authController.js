const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const prisma = require('../prisma/client')

const passwordMsg = "must be an strong password of alphabet and numbers";
const uniqueUser =
  "the provided username is in use by another user, please enter another one";
const confirmPasswordMsg = "the provided passwords must be the same";

const isUserUnique = async (value) => {
  const user = await prisma.user.findUnique({where:{
    username:value
  }});
  if (user) {
    throw new Error();
  }
};
const isPasswordMatches = (value, { req }) => value === req.body.password;

const validateSignupForm = [
  body("username")
    .trim()
    .notEmpty()
    .bail()
    .custom(isUserUnique)
    .withMessage(uniqueUser),
  body("password")
    .trim()
    .notEmpty()
    .bail()
    .isAlphanumeric()
    .withMessage(passwordMsg),
  body("confirm-password")
    .trim()
    .if((value, { req }) => {
      return req.body.password;
    })
    .custom(isPasswordMatches)
    .withMessage(confirmPasswordMsg),
];

exports.signup = [
  validateSignupForm,
  asyncHandler(async (req, res, next) => {
    res.locals.authRequest = 'register';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).redirect("/");
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
      if (err) {
        return next(err);
      }
      await prisma.user.create({data:{
        username:req.body.username,
        password:hashedPass,
      }});

      // create root folder for user directory
      await prisma.folder.create({
        data:{
          name: process.env.DIRECTORY_ROOT_FOLDER
        }
      })

      res.redirect("/");
    });
  }),
];

exports.login = passport.authenticate("local", {
  failureMessage: true,
  successRedirect: "/panel",
  failureRedirect: "/",
});

exports.logout = asyncHandler(async (req,res,next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.json({redirect:'/'})
  });
})