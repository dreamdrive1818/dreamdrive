require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());



// connect routes
const emailRoutes = require("./routes/emailRoutes");
app.use("/api", emailRoutes);

const webhookRoutes = require("./routes/webhookRoutes");
app.use("/api", webhookRoutes);




app.listen(5000, () => {
  console.log(`Server running`);
});