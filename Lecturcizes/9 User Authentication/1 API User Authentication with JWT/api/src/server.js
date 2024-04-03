require("dotenv").config();

const express = require("express");

const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const authorRoutes = require("./routes/authorRoutes");
app.use("/authors", authorRoutes);

const bookRoutes = require("./routes/bookRoutes");
app.use("/books", bookRoutes);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});