# Sapper SSR Firebase Hosting / Functions
---

### setup

```sh
# inside functions/
cd functions
npm install

# inside sapper-ssr/
npm install

# firebase hosting
firebase init hosting
# path : static

# firebase functions
firebase init functions
# make sure not to overwrite functions/ index.js | if overwritten, copy from repo


```
###### add firebase config to secrets/firebase.js
###### download and move service-account.json to secrets/
- secrets /
        - firebase.js [ configs ]
        
        - service-account-key.json [ service account key ]

---

### Test n Deploy
###### 
```sh
# dev
npm run dev

# run with functions
npm start

# deploy to firebase
npm run deploy
```

