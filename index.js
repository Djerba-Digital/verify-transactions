//  IMPORTS
const _ = require("colors");
const dotenv = require("dotenv");
const hash = require("json-hash");
const jwt = require("jsonwebtoken");
const connectDb = require("./config/db");
const { Kafka, logLevel } = require("kafkajs");

// ENV VARS
dotenv.config({ path: "./env/config.env" });

// DATA BASE MONGODB
connectDb();

//  MODELS
global.Log = require("./models/logs.model");

//  KAFKA
const kafka = new Kafka({
  logLevel: logLevel.INFO,
  clientId: "main-test-client",
  brokers: process.env.KAFKA_BROKERS.split(","),
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_KEY,
    password: process.env.KAFKA_SECRET,
  },
});

//  CONSUMERS
const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

//  ERRORS
const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.TOPIC,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      //  GET DATA
      const messageData = JSON.parse(message.value.toString("binary"));

      //  SET DATA
      const {
        _id,
        company,
        currentHash,
        prevHash,
        signature,
        timestamp,
        state,
      } = messageData;

      //  VERIFY SIGNATURE
      const object = jwt.verify(signature, process.env.DD_PUBLIC_KEY, {
        // Never forget to make this explicit to prevent
        // signature stripping attacks.
        algorithms: ["RS256"],
      });

      //  IF NO OBJECT
      if (!object) {
        console.log(`TRANSACTION ${_id} IS INVALID`.red);
        console.log(`REASON : SIGNATURE IS INVALID`.red);

        //  INVALID TRANSACTION
        process.exit(0);
      }

      //  CALL LATEST LOG
      const lastLog = await global.Log.findOne().sort({
        timestamp: -1,
      });

      ////////////////////////////////////////////////////////////////////////////////////////
      //  **  YOU CAN VERIFY THE AUTHENTICITY OF THE DATA BY COMPARING IT TO YOUR FACTS  **  //
      ////////////////////////////////////////////////////////////////////////////////////////

      //  SET NEW HASH
      const new_hash = hash
        .digest({
          company,
          state: hash.digest(state).toString(),
          prevHash: lastLog?.currentHash || null,
          timestamp: timestamp?.toString(),
        })
        .toString();

      //  VERIFY HASH
      const isEqual = new_hash === currentHash;

      //  IF NOT EQUAL
      if (!isEqual) {
        console.log(`TRANSACTION ${_id} IS INVALID`.red);
        console.log(`REASON : HASHES ARE NOT EQUAL`.red);

        //  INVALID TRANSACTION
        process.exit(0);
      }

      //  CONSOLE LOG SUCCESS
      console.log(`TRANSACTION ${_id} IS VALID`.green);
      console.log(`REASON : HASHES ARE EQUAL`.green);

      //  SAVE TO DB
      await global
        .Log({
          state,
          prevHash,
          currentHash,
          timestamp,
        })
        .save();

      //  CONSOLE LOG
      console.log(`*******  TRANSACTION DATA ID ${state.data._id}`.cyan);
    },
  });
};

run().catch((e) => console.error(`[worker/consumer] ${e.message}`, e));

//  EXEC POST ERROR
errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    console.log(`process.on ${type} error ${e}`);
    await consumer.disconnect();
    process.exit(0);
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    await consumer.disconnect();
  });
});
