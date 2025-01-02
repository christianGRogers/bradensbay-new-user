const express = require('express');
const cors = require('cors');
const { initializeApp: initializeClientApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');
const admin = require('firebase-admin');

const PORT = 3006;

// Firebase Client Configuration (for client SDK tasks like sign-in)
const firebaseConfig = {
    apiKey: "AIzaSyDmdf8NhoFAzXKGuBWYq5XoDrM5eNClgOg",
    authDomain: "bradensbay-1720893101514.firebaseapp.com",
    databaseURL: "https://bradensbay-1720893101514-default-rtdb.firebaseio.com/",
    projectId: "bradensbay-1720893101514",
    storageBucket: "bradensbay-1720893101514.appspot.com",
    messagingSenderId: "280971564912",
    appId: "1:280971564912:web:989fff5191d0512c1b21b5",
    measurementId: "G-DNJS8CVKWD"
};

// Service Account Key Path (for Admin SDK tasks)
const serviceAccountKeyPath = '/home/christian/bradensbay-1720893101514-firebase-adminsdk-5czfh-6849539d64.json';

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountKeyPath)),
    databaseURL: firebaseConfig.databaseURL,
});

// Initialize Firebase Client SDK
const firebaseApp = initializeClientApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Helper Function for Authentication using Client SDK
async function signup(email, password) {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Send verification email
        await sendEmailVerification(userCredential.user);

        return { message: "all good" };
    } catch (error) {
        console.error('Error during signup:', error.message);
        throw error;
    }
}

// Endpoint to Sign Up (using Client SDK)
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await signup(email, password);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Return detailed error message
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
