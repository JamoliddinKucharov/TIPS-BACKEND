const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// Foydalanuvchi modeli (keyinchalik ishlatamiz)
const User = require('../models/User');

// Google strategiyasi
passport.use(
  new GoogleStrategy(
    {
      clientID: '1029729026392-e1410rnsgl6hllnaj4t2vd4k98jgrdqe.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://tips-backend-one.vercel.app/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
 
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            password: "isGoogle"
          });
          console.log('Yangi foydalanuvchi yaratildi:', user);
        }


        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Facebook strategiyasi
passport.use(
  new FacebookStrategy(
    {
      clientID: '1104007761531785',
      clientSecret: '8d925ff626fb29ae502c4e6f0c9ab392',
      callbackURL: 'https://tips-backend-one.vercel.app/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            username: `${profile.name.givenName} ${profile.name.familyName}`,
            email: profile.emails[0].value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Sessiya sozlamalari
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
