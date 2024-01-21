const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const indexRouter = require("./routes/index");
const taskRouter = require("./routes/task");
const { verifyToken } = require("./routes/middleware");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routers
app.use("/", indexRouter);
app.use("/task", verifyToken, taskRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
