let firebaseConfig
let fb

if (process.browser) {
  fb = firebase
  firebaseConfig = process.env.FIREBASE_CONFIG
  if (typeof firebaseConfig === 'string')
    firebaseConfig = JSON.parse(firebaseConfig)
} else {
  fb = require('firebase-admin')
  let serviceAccount = process.env.FIREBASE_ADMIN_AUTH

  if (typeof serviceAccount === 'string')
    serviceAccount = JSON.parse(serviceAccount)

  firebaseConfig = {
    credential: fb.credential.cert(serviceAccount),
    databaseUrl: process.env.FIREBASE_DB_URL
  }
}

const app = fb.initializeApp(firebaseConfig)

export const db = app.firestore()

if (db.enablePersistence) db.enablePersistence()