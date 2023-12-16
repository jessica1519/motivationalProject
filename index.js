import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";
const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODBURI);

const postSchema = {
  content: String,
  author: String,
};

const Post = mongoose.model("Post", postSchema);
const weekday = [
  "Domenica",
  "Lunedi",
  "Martedi",
  "Mercoledi",
  "Giovedi",
  "Venerdi",
  "Sabato",
];

const data = {
  day: new Date().getDate(),
  month: new Date().toLocaleString("default", { month: "long" }),
  year: new Date().getFullYear(),
};
//await Post.insertMany(arrayPost); // da rimettere finite le prove

let findPost;
const select = async () => {
  let findPosts = await Post.aggregate([{ $sample: { size: 1 } }]); //il metodo aggregate associato a sample ritorna un array di elementi casuali, size è il numero di elementi che voglio nel mio array//
  findPost = findPosts[0];
};

app.get("/", async (req, res) => {
  await select();
  res.render("index.ejs", { post: findPost, data });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
