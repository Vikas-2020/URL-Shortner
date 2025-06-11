import express from "express";
import { nanoid } from "nanoid";
import fs from "node:fs";
const app = express();

const PORT = 8080;

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

app.use(express.urlencoded()); // Parses URL encoded Data

app.get("/", (req, res) => {
  res.sendFile(import.meta.dirname + "/index.html");
});

app.post("/shorten", (req, res) => {
  if (!isValidUrl(req.body.longUrl)) {
    res.status(400).json({
      success: false,
      message: "Invalid URL",
    });
    return;
  }

  const shortUrl = nanoid(8);

  const fileData = fs.readFileSync("urls.json");
  const urlsFromFile = JSON.parse(fileData.toString());
  urlsFromFile[shortUrl] = req.body.longUrl;
  fs.writeFileSync("urls.json", JSON.stringify(urlsFromFile));

  res.json({
    success: true,
    shortUrl: `https://url-shortner-rref.onrender.com/${shortUrl}`,
  });
});

app.get("/:shortUrl", (req, res) => {
  const fileData = fs.readFileSync("urls.json");
  const urlsFromFile = JSON.parse(fileData.toString());
  const longUrl = urlsFromFile[req.params.shortUrl];
  res.redirect(longUrl);
});

app.listen(PORT, () => console.log(`Server is up and running at port ${PORT}`));
