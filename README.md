Copy dotenv to .env

Modify the variables:

+ SECRET: secret defined in the webhook setting
+ PORT: port used to host the webhook server
+ BRANCH: brnach that triggers updating when someone pushed on
+ backend: name of backend service in pm2
+ frontend: name of frontend service in pm2

Generate a ssh key called `repo_key` in `${GIT_REPO}/webhook`.  

```bash
$ ssh-keygen
chmod 400 repo_key
```

Then, put `repo_key.pub` to the deploy keys in Github.