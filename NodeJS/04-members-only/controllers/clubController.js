const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { updateMembership } = require("../model/query");

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