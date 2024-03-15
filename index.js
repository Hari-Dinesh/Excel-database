const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const CSV = require("csvtojson");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose
  .connect(
    "mongodb+srv://Dinesh:Asdfg123@cluster0.8pjuhmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to the datatbase");
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Excel");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

const ItemSchema = new mongoose.Schema({
  ID: String,
  Gender: Number,
  Age: Number,
});

const Item = mongoose.model("Item", ItemSchema);

app.post("/addfile", upload.single("exl-file"), async (req, res) => {
  try {
    const jsonArray = await CSV().fromFile(req.file.path);
    await Item.insertMany(jsonArray);

    res.status(201).send("Data inserted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getdata", async (req, res) => {
  try {
    const items = await Item.find();

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.delete("/delete", (re, res) => {
  Item.deleteMany().then(res.send("data deleted successfully"));
});
app.get("/", (req, res) => {
  res.render("multiple");
});
app.post(
  "/addmfile",
  upload.fields([{ name: "file1" }, { name: "file2", maxCount: 4 }]),
  async (req, res) => {
    try {
      if (req.files) {
        if(req.files.file2.length>4||req.files.file1.length>1) {
          console.log("the error is in the if")
          res.send("max Count Reached");
        }
        res.send(req.files);
      } 
    } catch (error) {
      console.log("the error is in the catch")
      res.status(500).send(error);
    }
  }
);

app.listen(5050, () => {
  console.log(`Server is running`);
});
