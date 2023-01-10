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

app.route("/articles")
  .get(async (req, res) => {
    try {
      const result = await Article.find();
      res.send(result);
    } catch(error) {
      res.send(error);
    }
  })
  .post(async (req, res) => {
    try {
      const title = req.body.title;
      const content = req.body.content;
      const newArticle = new Article({"title": title, "content": content});
      await newArticle.save();
      res.send(newArticle);
    } catch(error) {
      res.send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteMany();
      const currentArticles = await Article.find();
      res.send(currentArticles);
    } catch(error) {
      res.send(error);
    }
  });

app.route("/articles/:articleTitle")
.get(async (req, res) => {
  try {
    const articleToFind = req.params.articleTitle;
    const theArticle = await Article.findOne({title: articleToFind});
    res.send(theArticle ? theArticle : `No Article found of name: ${articleToFind}`);
  } catch(error) {
    res.send(error);
  }
})
.put(async (req, res) => {
  try {
    const articleToFind = req.params.articleTitle;
    const theArticle = await Article.findOne({title: articleToFind});
    if(theArticle){
      theArticle.title = req.body.title;
      theArticle.content = req.body.content;
      await theArticle.save();
      res.send(theArticle);
    } else {
      res.send(`No Article found of name: ${articleToFind}`);
    }
  } catch(error) {
    res.send(error);
  }
})
.patch(async (req, res) => {
  try {
    const articleToFind = req.params.articleTitle;
    const theArticle = await Article.findOne({title: articleToFind});
    if(theArticle){
      req.body.title ? theArticle.title = req.body.title : null;
      req.body.content ? theArticle.content = req.body.content : null;
      await theArticle.save();
      res.send(theArticle);
    } else {
      res.send(`No Article found of name: ${articleToFind}`);
    }
  } catch(error) {
    res.send(error);
  }
})
.delete(async (req, res) => {
  try {
    const articleToFind = req.params.articleTitle;
    const result = await Article.deleteOne({title: articleToFind});
    res.send(result.deletedCount > 0 ? `Article ${articleToFind} deleted` : `No Article found of name: ${articleToFind}`);
  } catch(error) {
    res.send(error);
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server listening in port 3000"));
