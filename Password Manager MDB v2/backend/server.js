const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");
const crypto = require('crypto');

dotenv.config();

// Define encryption algorithm and secret key
const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Your 32-byte key in hex
const ivLength = 16; // IV length for AES-256-CBC is always 16 bytes

// Encryption function
const encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength); // Generate a random IV (16 bytes)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv); // Create cipher with key and IV
  let encrypted = cipher.update(text, 'utf8', 'hex'); // Encrypt text
  encrypted += cipher.final('hex'); // Finalize encryption
  return `${iv.toString('hex')}:${encrypted}`; // Return IV and encrypted text, joined by ":"
};

// Decryption function
const decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(':'); // Split IV and encrypted text
  const iv = Buffer.from(ivHex, 'hex'); // Convert IV back from hex
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv); // Create decipher with key and IV
  let decrypted = decipher.update(encrypted, 'hex', 'utf8'); // Decrypt text
  decrypted += decipher.final('utf8'); // Finalize decryption
  return decrypted;
};

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

// App & Database
const dbName = process.env.DB_NAME;
const app = express();
const port = 3000;

// Middleware
app.use(bodyparser.json());
app.use(cors());

const saltRounds = 10;

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  // Split "Bearer" and the token itself
  const tokenParts = token.split(' ');
  if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
    return res.status(401).json({ message: 'Invalid token format!' });
  }

  jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id; // Save user ID in request
    next();
  });
};

// User Registration Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const db = client.db(dbName);
  const collection = db.collection("users");
  const userExists = await collection.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: "User already exists!" });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = { username, email, password: hashedPassword };

  const result = await collection.insertOne(newUser);

  // Respond with success message
  res.json({ message: "User registered successfully!" });
});

// User Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const db = client.db(dbName);
  const collection = db.collection("users");
  const user = await collection.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  // Compare the entered password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password!" });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Return the token to the client
  res.json({ token });
});

// get all passwords
app.get("/passwords", verifyToken, async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const passwords = await collection.find({ userId: req.userId }).toArray();

  // Check if passwords array is empty
  if (passwords.length === 0) {
    return res.json([]); // Return an empty array if no passwords exist
  }

  const decryptedPasswords = passwords.map(password => ({
    ...password,
    password: decrypt(password.password), // Decrypt each password
  }));

  res.json(decryptedPasswords);
});

// Save password (only accessible with valid JWT)
app.post("/passwords", verifyToken, async (req, res) => {
  const passwordData = req.body;
  passwordData.userId = req.userId; // Associate password with user
  passwordData.password = encrypt(passwordData.password);

  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const result = await collection.insertOne(passwordData);

  res.json({ success: true, result });
});

// Delete password (only accessible with valid JWT)
app.delete("/passwords/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const db = client.db(dbName);
  const collection = db.collection("passwords");

  const result = await collection.deleteOne({ id: id, userId: req.userId });
  if (result.deletedCount > 0) {
    res.json({ success: true, message: "Password deleted successfully!" });
  } else {
    res.status(404).json({ message: "Password not found!" });
  }
});

// update password by id
app.put("/passwords/:id", async (req, res) => {
  const { id } = req.params; // get the id from URL params
  const { _id, ...updatedPassword } = req.body; // destructure to remove _id from the update

  const db = client.db(dbName);
  const collection = db.collection("passwords");

  updatedPassword.password = encrypt(updatedPassword.password);

  // Update the password entry with the matching id (but don't update the _id field)
  const findResult = await collection.updateOne(
    { id: id }, // find by id (not _id, since you're storing uuid as id)
    { $set: updatedPassword } // update all fields except _id
  );

  if (findResult.matchedCount > 0) {
    res.send({ success: true, message: "Password updated successfully!" });
  } else {
    res.status(404).send({ success: false, message: "Password not found!" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
