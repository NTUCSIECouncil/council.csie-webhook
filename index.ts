import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { exit } from 'process';
import { ParamsDictionary } from 'express-serve-static-core';
import QueryString from 'qs';
import { exec } from 'child_process';

dotenv.config();
if (process.env.SECRET === undefined || process.env.PORT === undefined || process.env.BRANCH === undefined) {
    console.log('No environment variables. Maybe missing .env?');
    exit(1);
}
const SECRET = process.env.SECRET;
const PORT = process.env.PORT;
const BRANCH = process.env.BRANCH;
const PM2_FRONTEND = process.env.FRONTEND;
const PM2_BACKEND = process.env.BACKEND;
const PM2_WEBHOOK = process.env.WEBHOOK;

const verify_signature = (req: express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>
) => {
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");
  let trusted = Buffer.from(`sha256=${signature}`, 'ascii');
  let untrusted = Buffer.from(req.get("x-hub-signature-256") as string, 'ascii');
  return crypto.timingSafeEqual(trusted, untrusted);
};

const app = express();

app.use(express.json({type: 'application/json'}), (request, response, next) => {
  if (!verify_signature(request)) {
    response.sendStatus(401);
    return;
  }
  next();
});

app.post('/', express.json({type: 'application/json'}), (request, response) => {
  const githubEvent = request.get('x-github-event');

  if (!verify_signature(request)) {
    response.sendStatus(401);
    return;
  }
  response.sendStatus(200);

  if (githubEvent === 'ping') {
    console.log('GitHub sent the ping event');
  }
  else if (githubEvent === 'push') {
    const branch = (request.body.ref as string).substring(11);
    if (branch === BRANCH) {
      console.log(`${new Date().toLocaleString()} => someone pushed to ${BRANCH}. Started pulling & restarting.`);
      exec(`./pull_and_restart.sh "${PM2_FRONTEND}" "${PM2_BACKEND}"`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log(`Restarted successfully.`);
      });
    }
  }
});

app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT} and updates on branch ${BRANCH}`);
})
