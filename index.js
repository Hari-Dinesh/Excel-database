const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const CSV=require("csvtojson");
const app = express();

mongoose
.connect(
    "mongodb+srv://Dinesh:Asdfg123@cluster0.8pjuhmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  ).then(() => {
    console.log("connected to the datatbase");
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./Excel");
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname);
    },
  });
  const upload= multer({
    storage:storage
  })

const ItemSchema = new mongoose.Schema({

  ID:String,
  Gender:Number,
  Age:Number,
});

const Item = mongoose.model('Item', ItemSchema);

app.post('/addfile', upload.single('exl-file'), async (req, res) => {
    try {
      const jsonArray = await CSV().fromFile(req.file.path);
      await Item.insertMany(jsonArray);
  
      res.status(201).send('Data inserted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.get('/getdata', async (req, res) => {
  try {
    const items = await Item.find();

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.delete('/delete',(re,res)=>{
    Item.deleteMany().then(res.send('data deleted successfully'))
})

app.listen(5050, () => {
  console.log(`Server is running`);
});
