const { PORT } = require("./secret.js");

const app = require("./app.js");
const connectDB = require("./config/db.js");

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connections established");
  } catch (error) {
    console.error("Failed to establish connections", error);
  }
};

startServer();

// Conditionally listen to the server in development mode
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
