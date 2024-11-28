Copy dotenv to .env

Modify the variables:

+ SECRET: secret defined in the webhook setting
+ PORT: port used to host the webhook server
+ BRANCH: branch that triggers updating when someone pushed on
+ backend: name of backend service in pm2
+ frontend: name of frontend service in pm2

Assume `${GIT ROOT REPO}` be the root directory of this git repository (that is, a directory containing `.git`).
Generate a ssh key called `repo_key` in `${GIT ROOT REPO}/webhook`.  

```bash
$ ssh-keygen
chmod 400 repo_key
```

Then, put `repo_key.pub` to the "deploy keys" on Github.
