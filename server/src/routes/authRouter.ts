import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const frontendURL = process.env.FRONTEND_URL;
if (!frontendURL) {
  throw new Error("Could not retrieve frontend URL from environment");
}

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/presentations",
    ],
  })
);

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err: any, user: any, info: any) => {
    if (err) {
      console.error("Passport error:", err);
      return res.redirect("/login?error=oauth");
    }
    if (!user) {
      console.error("User is undefined");
      return res.redirect("/login?error=no-user");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error in req.logIn: ", err);
        return res.redirect(`${frontendURL}`);
      }

      //Store Access Token in session
      const accessToken = info?.accessToken || user?.accessToken;
      if (accessToken) {
        // @ts-ignore
        req.session.accessToken = accessToken;

        //TESTING:
        console.error("Authenticated New User at callback");

        //console.error(`Session: ${JSON.stringify(req.session)}`);

        //Manually saves session
        req.session.save((err) => {
          if (err) {
            console.error("Session save error: ", err);
            return res.redirect(`${frontendURL}?error=session`);
          }

          console.error("Session saved succesfully, redirecting...");
          return res.redirect(`${frontendURL}`);
        });
      } else {
        console.error("No access token found to store");
        return res.redirect(`${frontendURL}`);
      }
    });
  })(req, res, next);
});

router.get("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session?.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(frontendURL);
    });
  });
});

export default router;
