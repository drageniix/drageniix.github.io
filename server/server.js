const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/test", (req, res, next) =>
  res.status(200).json({
    message: "Hello World!"
  })
);

app.use((req, res, next) =>
  res.status(404).json({
    message: "Page not found.",
    data: req.url
  })
);

app.use((error, req, res, next) =>
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    data: error.data
  })
);

app.listen(process.env.PORT || 5000);
