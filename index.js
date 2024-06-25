const express = require("express");
const contactRouter = require("./routes/contacts");
const app = express();

app.use(express.json());
app.use("/api/v1",contactRouter)
/*
Forwarding all requests to the contact router.
In future if we update the apis or create new set of apis we can simply change v1 to v2 (version 2) and forward requests to the new router
*/
app.listen(3000,"0.0.0.0");