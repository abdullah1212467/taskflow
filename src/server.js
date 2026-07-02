const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
const connectDB = require("./config/Db-config.js")
 require("./config/redis_config.js")
 require("./workers/reminder.worker.js");
 require("./workers/email.worker.js")

const app = require("./app");

const PORT = process.env.PORT || 5000;

// connectDB()
connectDB()

// port is listen on "http://localhost:5000/"
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

