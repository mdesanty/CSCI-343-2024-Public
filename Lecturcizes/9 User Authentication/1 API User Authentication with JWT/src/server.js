require("dotenv").config();

const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.json());

const userRoutes = require('./routes/authRoutes');
app.use('/auth', userRoutes);

const authorRoutes = require("./routes/authorRoutes");
app.use("/authors", authorRoutes);

const bookRoutes = require("./routes/bookRoutes");
app.use("/books", bookRoutes);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});