//  DONE 100% SO FAR! GOOD WORK.
const mongoose = require("mongoose");

const connectDB = async () => {
  //  CONNECT TO MONGO DB
  const mongo = await mongoose.connect(process.env.MONGO_URI, {
    ssl: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  //  LOG CONNECTION
  console.log(
    "Main MongoDB Connected : " + `${mongo.connection.host}`.cyan.underline.bold
  );

  //  RETURN CONNECTION
  return mongo.connection;
};

module.exports = connectDB;
