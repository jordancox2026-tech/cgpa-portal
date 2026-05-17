const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());

const PORT = 5000;

const DATA_FOLDER = path.join(__dirname, "data");

const studentsIndex = [];

/* ----------------------------- */
/* GET ALL JSON FILES */
/* ----------------------------- */

function getAllJsonFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      getAllJsonFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".json")) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllJsonFiles(DATA_FOLDER);

console.log(`Found ${allFiles.length} JSON files`);

/* ----------------------------- */
/* CREATE SEARCH INDEX */
/* ----------------------------- */

allFiles.forEach((filePath) => {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");

    const data = JSON.parse(raw);

    if (!data.student_information) return;

    studentsIndex.push({
      name:
        data.student_information.name?.toLowerCase() ||
        "",

      reg:
        data.student_information.register_number?.toLowerCase() ||
        "",

      data,
    });
  } catch (err) {}
});

console.log(
  `Indexed ${studentsIndex.length} students`
);

/* ----------------------------- */
/* SEARCH API */
/* ----------------------------- */

app.get("/search", (req, res) => {
  const query =
    req.query.query?.toLowerCase().trim() || "";

  console.log("Searching:", query);

  if (!query) {
    return res.json([]);
  }

  const results = studentsIndex
    .filter((student) => {
     const nameWords = student.name.split(" ");

const matchesName =
  student.name.includes(query) ||
  nameWords.some((word) =>
    word.startsWith(query)
  );

const matchesReg =
  student.reg.includes(query);

return matchesName || matchesReg;
    })
    .slice(0, 10)
    .map((student) => student.data);

  console.log(
    "Results found:",
    results.length
  );

  res.json(results);
});

/* ----------------------------- */
/* START SERVER */
/* ----------------------------- */

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});