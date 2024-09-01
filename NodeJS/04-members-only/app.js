require("dotenv").config();
const express = require("express");
const { join } = require("node:path");
const authRouter = require("./routes/authRouter");
const session = require("express-session");
const passport = require("passport");
const blogRouter = require("./routes/blogRouter");
const asyncHandler = require("express-async-handler");
const { addBlog, getAllPosts, getUserByID } = require("./model/query");
const clubRouter = require("./routes/clubRouter");


require("./config/passport");

const app = express();

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.use(
  session({
    secret: "beny",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: true,
      secure: false,
    },
  })
);
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.errors = req.session.messages;
  delete req.session.messages;
  res.locals.user = req.user;
  next();
});

app.get("/", asyncHandler(async (req,res,next)=>{
  const posts =await getAllPosts();
  res.render('index',{posts,title:'Club House'})
}));

app.use("/auth", authRouter);
app.use((req,res,next)=>{
  if (req.isAuthenticated()) {
    next()
  } else {
    res.send("<h1>You are not authenticated</h1>");
  }
})

app.use('/join', clubRouter);
app.use('/blog', blogRouter);


app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});
app.listen(process.env.PORT, () =>
  console.log("app is listening on port 3000 !!")
);
