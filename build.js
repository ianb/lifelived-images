const fs = require("fs");
const path = require("path");

const directories = ["./images", "./test"];

directories.forEach((dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      if (dir === "./images" && ext === ".webp") {
        return false;
      }
      return ext === ".png" || ext === ".jpg" || ext === ".webp";
    });

    const fileInfo = imageFiles.map((filename) => {
      const filePath = path.join(dir, filename);
      const fileStats = fs.statSync(filePath);

      return {
        filename,
        bytes: fileStats.size,
      };
    });

    const dirBaseName = path.basename(dir);
    const content = `window.files = window.files || {}; window.files[${JSON.stringify(
      dirBaseName
    )}] = ${JSON.stringify(fileInfo, null, 2)};`;
    const moduleContent = `const files = ${JSON.stringify(fileInfo, null, 2)};
const dirBaseName = ${JSON.stringify(dirBaseName)};
export { files, dirBaseName };
`;
    fs.writeFile(path.join(dir, "files.js"), content, (err) => {
      if (err) {
        console.error(`Error writing to ${dir}/files.js:`, err);
        return;
      }
      console.log(`File info written successfully to ${dir}/files.js`);
    });
    fs.writeFile(path.join(dir, "files-module.js"), moduleContent, (err) => {
      if (err) {
        console.error(`Error writing to ${dir}/files-module.js:`, err);
        return;
      }
      console.log(`File info written successfully to ${dir}/files-module.js`);
    });
  });
});
