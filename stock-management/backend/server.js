const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;
const connectDB = require('./config/db')
const cors = require('cors')
const session = require('./config/session')
const {auth} = require('./middleware/auth.js')
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  credentials: true, // allow cookies/sessions
}));
connectDB();
app.use(express.json())
app.use(session);

app.get('/', (req,res) =>
{
    res.send("hello world")
})
app.use('/register', require("./routes/register"))
app.use('/login', require("./routes/login"))
app.use('/products', auth, require("./routes/productRoute"))
app.use('/logout', auth, require("./routes/logout"))
app.use('/me', auth, require("./routes/me"))
app.listen(PORT, () =>
{
    console.log("Server running on ",PORT)
})