const fs = require("fs");
const path = require("path");

const directories = ["./images", "./test", "./portraits"];

directories.forEach((dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      if (
        (dir === "./images" || dir === "./portraits") &&
        (ext === ".webp" || ext === ".png")
      ) {
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
    const moduleContent =
      `
/* eslint-disable comma-dangle */
type Files = {
  filename: string;
  bytes: number;
};
const files: Files[] = ${JSON.stringify(fileInfo, null, 2)};
const dirBaseName: string = ${JSON.stringify(dirBaseName)};
export { files, dirBaseName };
`.trim() + "\n";
    fs.writeFile(path.join(dir, "files.js"), content, (err) => {
      if (err) {
        console.error(`Error writing to ${dir}/files.js:`, err);
        return;
      }
      console.log(`File info written successfully to ${dir}/files.js`);
    });
    fs.writeFile(path.join(dir, "imageFiles.ts"), moduleContent, (err) => {
      if (err) {
        console.error(`Error writing to ${dir}/imageFiles.ts:`, err);
        return;
      }
      console.log(`File info written successfully to ${dir}/imageFiles.ts`);
    });
  });
});
