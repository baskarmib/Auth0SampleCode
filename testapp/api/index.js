const express = require("express");
const app = express();
const external = require("./testapi/external");
const order = require("./testapi/order");

app.use(express.json({extended:false}));
app.use("/api/external",external);
app.use("/api/order",order);

const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>console.log(`Server is running in port ${PORT}`));