require('dotenv').config();

const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');

const Role = require('../models/Role');
const User = require('../models/User');

const passportOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

const jwtStrategy = new Strategy(passportOptions, async (req, payload, done) => {
  const role = await Role
    .query()
    .where('role', req.params.role)
    .first();

  if (!role) {
    done(new Error('Role not found'), null);
  }

  const user = await User
    .query()
    .omit(['password'])
    .findOne({username:payload.username})
    .then(foundUser => {return foundUser});

  if (user.role_id === role.id || user.role_id > 1) {
    done(null, user);
  }else {
    done(new Error('Invalid permissions for this request.'), null);
  }
});

passport.use(jwtStrategy);

const authGuard = {
  jwt(role) {
    return (req, res, next) => {
      req.params.role = role;
      passport.authenticate('jwt', { session: false })(req, res, next);
    }
  }
}

module.exports = authGuard;
