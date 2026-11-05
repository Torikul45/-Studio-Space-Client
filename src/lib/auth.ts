
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is missing. Check your .env.local file.");
}

const mongoClient = new MongoClient(mongoUri);
const db = mongoClient.db("cat-harry");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // JWT Session Cookie
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
      strategy: "jwt",
    },
  },

  // JWT Plugin with JWKS-backed session cookie
  plugins: [
    jwt({
      sessionCookieCache: true,
    }),
  ],
});
