import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/User';

export const configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      // This "verify" callback runs after Google successfully authenticates the user
      async (accessToken: string, refreshToken: string, profile: Profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0].value;
          const name = profile.displayName;

          // Find a user by their unique Google ID
          let user = await User.findOne({ googleId });

          if (user) {
            // If user exists, pass them to the next middleware
            return done(null, user);
          }

          // If no user found with googleId, check if an account exists with that email
          user = await User.findOne({ email });

          if (user) {
            // If email exists, link the Google account to it
            user.googleId = googleId;
            user.isVerified = true; // Google verifies emails
            await user.save();
            return done(null, user);
          }

          // If user doesn't exist at all, create a new one
          const newUser = new User({
            googleId: googleId,
            name: name,
            email: email,
            isVerified: true, // Mark as verified since Google handles it
          });

          await newUser.save();
          return done(null, newUser);

        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};