const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());

const PORT = 5000;

const DATA_FOLDER = path.join(__dirname, "data");

/* -------------------------------- */
/* GET ALL JSON FILES */
/* -------------------------------- */

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

/* -------------------------------- */
/* SEARCH API */
/* -------------------------------- */

app.get("/search", (req, res) => {
  const query =
    req.query.query?.toLowerCase() || "";

  if (!query) {
    return res.json([]);
  }

  const results = [];

  for (const filePath of allFiles) {
    try {
      const data = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
      );

      const info = data.student_information;

      if (!info) continue;

      const name =
        info.name?.toLowerCase() || "";

      const reg =
        info.register_number?.toLowerCase() || "";

      if (
        name.includes(query) ||
        reg.includes(query)
      ) {
        results.push(data);
      }

      if (results.length >= 20) break;
    } catch (error) {}
  }

  res.json(results);
});

/* -------------------------------- */
/* START SERVER */
/* -------------------------------- */

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});