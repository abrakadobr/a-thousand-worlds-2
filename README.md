# A Thousand Worlds 2.0

## Setup
1. Clone this repo
1. `npm install`
1. `cd functions && npm install && cd ..`
1. `npm install -g firebase-tools`
1. Create new project at [firebase.google.com](http://firebase.google.com)
1. Create web app in Firebase project
1. Save Firebase config into `.env.local`
    - App → Firebase SDK snippet → Config
1. Create Realtime Database in Firebase project
1. Enable Firebase Storage
1. Configure CORS policy for storage bucket
    - Copy the storage folder path which appears at the top of the Storage → Files table, e.g. `gs://a-thousand-worlds.appspot.com`
    - Open the [GCP console](console.cloud.google.com) and start a cloud terminal session by clicking the >\_ icon button in the top navbar.
    - Click the "Open Editor" button with the pencil icon.
    - Create `cors.json` with the contents of `firebase.storage.cors.json`.
    - Click the "Open Terminal" button and run `gsutil cors set cors.json gs://a-thousand-worlds.appspot.com`. Use the storage folder path you copied in the first step above.
1. Enable Email/Password authentication
    - Authentication → Sign-in method
1. Add `firebase.rules.json` to Realtime Database access rules and publish
    - Realtime Database → Rules
1. `firebase login`
1. Set active Firebase app: `firebase use --add`
1. Deploy Firebase functions: `firebase deploy --only functions`
1. Add Request URL from Firebase Functions dashboard to `VUE_APP_SEARCH_SERVICE_URL` in .env.local
    - https://console.firebase.google.com/u/0/project/PROJECT_NAME/functions/list
1. Add Goodreads API key for firebase function
    - `firebase functions:config:set goodreads.api_key="YOUR_API_KEY"`
1. Copy firebase config for local emulator:
  - `firebase functions:config:get > functions/.runtimeconfig.json`
1. Redeploy Firebase functions: `firebase deploy --only functions`

### Email
1. Create and configure mailgun account
1. Update DNS sending (TXT) and optionally receiving (MX) records
1. Generate sending SMTP credentials for domain
    - Maingun dashboard -> Sending -> Domain settings -> SMTP credentials
    - For `postmater@DOMAIN` click `Reset password` -> on appeared popup click `Copy` button -> temporary save password for later use
    - Or generate new SMTP user and use this user later replacing postmaster@DOMAIN
1. Set firebase function configuration to send emails:
    - `firebase functions:config:set mailgun.user="postmaster@DOMAIN" mailgun.password="POSTMASTER_PASSWORD" mailgun.sender="sender-email@DOMAIN"` (sender email can be any at your domain, for example: bot@DOMAIN)
1. Copy firebase config for local emulator:
  - `firebase functions:config:get > functions/.runtimeconfig.json`
1. Generate service account key
    - Firebase Project -> Settings -> Service Accounts -> Generate new private key
    - Save to `/functions/serviceAccountKey.json`

## Scripts

### Compile and hot-reload for development

Server must be restarted if `.env` changes

```sh
npm run serve
```

### Lint and fix files
```sh
npm run lint
```

### Run locally
```sh
# pull remote config down to be used by emulator
firebase functions:config:get > functions/.runtimeconfig.json

# build and run emulators
npm run build
firebase emulators:start
```

### Deploy
```sh
npm run deploy
```

## Customize Vue configuration
See [Configuration Reference](https://cli.vuejs.org/config/)
