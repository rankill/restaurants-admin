const mongoose = require("mongoose");
const { mongoURI } = require("./config");

mongoose.connection.on("error", (err) => {
  console.log(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

exports.connect = () => {
  mongoose
    .connect(mongoURI, {
      useCreateIndex: true,
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("mongoDB connected..."));
  return mongoose.connection;
};
