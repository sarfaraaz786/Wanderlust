// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main().then(() => console.log("Connected to DB"))
//     .catch((err) => console.log(err));

// async function main(){
//     await mongoose.connect(MONGO_URL);
// }

// const initDB = async() => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({ ...obj, owner: "697c87b7c7d516c0aa7a5640"}));
//     await Listing.insertMany(initData.data);
//     console.log("data was intialized");
// };

// initDB();


const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect DB
main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Initialize DB with coordinates
const initDB = async () => {
  await Listing.deleteMany({});

  for (let obj of initData.data) {
    try {
      // Get coordinates using OpenStreetMap (Nominatim API)
      const geoRes = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: `${obj.location}, ${obj.country}`,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "wanderlust-project",
          },
        }
      );

      if (geoRes.data.length > 0) {
        obj.geometry = {
          type: "Point",
          coordinates: [
            parseFloat(geoRes.data[0].lon),
            parseFloat(geoRes.data[0].lat),
          ],
        };
      } else {
        // fallback (if not found)
        obj.geometry = {
          type: "Point",
          coordinates: [0, 0],
        };
      }

      obj.owner = "697c87b7c7d516c0aa7a5640";

      const listing = new Listing(obj);
      await listing.save();

      console.log(`📍 Added: ${obj.title}`);
    } catch (err) {
      console.log("❌ Error inserting:", obj.title);
      console.log(err.message);
    }
  }

  console.log("🎯 Database initialized successfully!");
  mongoose.connection.close();
};

initDB();
