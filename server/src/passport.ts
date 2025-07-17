import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("Backend URL not set");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      //TODO: Replace this URL with express backend URl on deploy
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = { profile, accessToken };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user); //Store entire user object in session
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});
