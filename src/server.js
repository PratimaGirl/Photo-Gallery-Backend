// server.js
require("dotenv").config();
// require("dotenv").config({ path: "./server/.env" });

const connectDB = require("./src/config/db");
const app = require("./src/app");

// Connect to database
connectDB();

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
