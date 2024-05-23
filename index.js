const path = require("path");
const express = require("express");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  fs.readdir("./tasks", function (err, files) {
    res.render("index", { files: files });
  });
});

app.get("/tasks/:filename", function (req, res) {
  var filename = req.params.filename;
  fs.readFile(`./tasks/${filename}`, "utf-8", function (err, filedata) {
    filename = filename.replace(".txt", "");
    res.render("task", { filename: filename, filedata: filedata });
  });
});

app.get("/edit/:filename", function (req, res) {
  var filename = req.params.filename;
  fs.readFile(`./tasks/${filename}`, "utf-8", function (err, filedata) {
    filename = filename.replace(".txt", "");
    res.render("edit", { filename: filename, filedata: filedata });
  });
});

app.post("/create", function (req, res) {
  if (req.body.title == "") {
    console.log("Empty file name");
    res.redirect("/");
  } else {
    fs.writeFile(
      `./tasks/${req.body.title}.txt`,
      req.body.details,
      function (err) {
        res.redirect("/");
      }
    );
  }
});

app.post("/edit", function (req, res) {
  let oldPath = `./tasks/${req.body.title}.txt`;
  let newPath = `./tasks/${req.body.updatedTitle}.txt`;

  fs.rename(oldPath, newPath, function (err) {
    fs.readFile(newPath, "utf-8", function (err, filedata) {
      fs.writeFile(newPath, req.body.updatedDetails, function (err) {
        console.log("File Updated");
        res.redirect("/");
      });
    });
  });
});


app.get("/delete/:filename", function (req, res) {
  fs.unlink(`./tasks/${req.params.filename}`, function (err) {
    res.redirect('/')
  });
});

app.listen(3000, function (req, res) {
  console.log("Running on port 3000");
});
