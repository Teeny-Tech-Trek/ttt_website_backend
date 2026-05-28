const { google } = require("googleapis");
const readline = require("readline");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  "https://www.googleapis.com/auth/calendar",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: scopes,
});

console.log("\nOpen this URL in browser:\n");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPaste code here: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("\nTOKENS:\n");
    console.log(tokens);

    rl.close();
  } catch (error) {
    console.error(error);
    rl.close();
  }
});