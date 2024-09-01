const bcrypt = require("bcryptjs");
const passport = require('passport');
const { getUserByID, getUserByEmail } = require("../model/query");

const LocalStrategy = require("passport-local").Strategy;

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUserByEmail(username);
    if (!user) {
      return done(null, false, { message: "Incorrect username or password" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return done(null, false, { message: "Incorrect username or password" });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserByID(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
