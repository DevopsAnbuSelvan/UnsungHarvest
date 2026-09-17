export default () => ({
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'unsung-harvest',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  },
});
