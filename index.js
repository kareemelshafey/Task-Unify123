const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// routes
const ToDoRoutes = require("./src/routes/ToDo");
const UserRoutes = require("./src/routes/User");


const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/todo", ToDoRoutes);
app.use("/users", UserRoutes)

mongoose.connect('mongodb://127.0.0.1/test').then(()=>{
    console.log("DB Connected Successfully");
});

app.listen(port, () => {
  console.log(`Server started at port http://localhost:${port}`);
});