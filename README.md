It is ASSUMED that all tracking services and webhook are in the same directory, e.g.
```
.
├── council.csie-backend
├── council.csie-frontend
└── council.csie-webhook
```
Also, all directories have to be cloned.

Copy `dotenv` to `.env`

Generate a random token to fill in the `secret` field in the webhook setting. Then, modify the variables:
+ SECRET: secret filled in the webhook setting
+ PORT: port used to host the webhook server

Modify `tracking_services.ts` to set which services to track.

Generate an ssh key called `repo_key` in the top-level directory:
```bash
$ ssh-keygen
chmod 400 repo_key
```
It will be used to pull the repositories of tracking services.

Finally, create a webhook on Github.
