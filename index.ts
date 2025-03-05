import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { exit } from 'process';
import { ParamsDictionary } from 'express-serve-static-core';
import QueryString from 'qs';
import { exec } from 'child_process';
import trackingServices from './tracking_services';

dotenv.config();
if (process.env.SECRET === undefined || process.env.PORT === undefined) {
  console.log('No environment variables. Maybe missing .env?');
  exit(1);
}
const SECRET = process.env.SECRET;
const PORT = process.env.PORT;

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
    if (!(request.body.ref as string).startsWith("refs/heads/")) // not pushed to a branch
      return;

    const branch = (request.body.ref as string).substring("refs/heads/".length);
    const repository = request.body.repository.full_name;
    for (const service of trackingServices) {
      if (service.branch !== branch || service.repository !== repository)
        continue;

      console.log(`Someone pushed to ${service.name}. Started pulling & restarting.`);
      exec(`./pull_and_restart.sh "${service.directory}" "${service.nameOnPm2}"`, (error, stdout, stderr) => {
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
  console.log(`The application is listening on port ${PORT}`);
})
