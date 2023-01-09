import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

const app = express();
// instead of body-parser
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static("public"));

try {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
} catch(error) {
  console.log(error);
}

const articlesSchema = new mongoose.Schema({
  title : {type: String, required: true},
  content : {type: String}
});
const Article = mongoose.model("Article", articlesSchema);

app.get("/articles", async (req,res) => {
  try {
    const result = await Article.find();
    res.send(result);
  } catch(error) {
    res.send(error);
  }
});

app.post("/articles", async (req,res) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const newArticle = new Article({"title": title, "content": content});
    await newArticle.save();
    res.send(newArticle);
  } catch(error) {
    res.send(error);
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server listening in port 3000"));