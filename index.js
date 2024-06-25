const express = require("express");
const contactRouter = require("./routes/contacts");
const app = express();

app.use(express.json());
app.use("/api/v1",contactRouter)

app.listen(3000,"0.0.0.0");