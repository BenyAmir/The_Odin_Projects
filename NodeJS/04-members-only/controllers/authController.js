const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const { getUserByEmail, insertUser,updateMembership } = require("../model/query");

const alphaMsg = "must only contain alphabet letters.";
const emailMsg = "must be an valid email";
const passwordMsg = "must be an strong password of alphabet and numbers";
const uniqueUser =
  "the provided e-mail address is in use by another user, please enter another one";
const confirmPasswordMsg = "the provided passwords must be the same";

const isEmailUnique = async (value) => {
  const user = await getUserByEmail(value);
  if (user) {
    throw new Error();
  }
};
const isPasswordMatches = (value, { req }) => value === req.body.password;

const validateSignupForm = [
  body("firstName").trim().notEmpty().bail().isAlpha().withMessage(alphaMsg),
  body("lastName").trim().notEmpty().bail().isAlpha().withMessage(alphaMsg),
  body("userName")
    .trim()
    .notEmpty()
    .bail()
    .isEmail()
    .withMessage(emailMsg)
    .bail()
    .custom(isEmailUnique)
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        errors: errors.array(),
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
      if (err) {
        return next(err);
      }
      const { password, membership, ...user } = req.body;
      await insertUser({
        password: hashedPass,
        membership: Boolean(membership),
        ...user,
      });
      res.redirect("/");
    });
  }),
];

exports.getLogin = asyncHandler(async (req, res, next) => {
  res.render("login");
  //   res.render("login",{error:req.session.messages});
});

exports.postLogin = passport.authenticate("local", {
  failureMessage: true,
  successRedirect: "/",
  failureRedirect: "/auth/login",
});

exports.getJoin = asyncHandler(async (req,res,next)=>{
  res.render("join")
})

const validateSecret = (value) => {
  return value === process.env.SECRET
}

const validateJoinForm = [
  body("secret").trim().notEmpty().bail().custom(validateSecret).withMessage('the entered secret is wrong, you can not join the club at the moment'),
];

exports.joinClub = [
  validateJoinForm,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("join", {
        errors: errors.array(),
      });
    }
    
    await updateMembership(req.user.id);
    res.redirect("/");
  }),
];

exports.logout = asyncHandler(async (req,res,next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.json({redirect:'/'})
  });
})