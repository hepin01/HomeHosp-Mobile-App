const fs = require("fs");
const path = require("path");
//console.log(__dirname);

const imageFileNames = () => {
  const array = fs
    .readdirSync("../assets/Images/")
    .filter(file => {
      return file.endsWith(".png");
    })
    .map(file => {
      return file.replace("@2x.png", "").replace("@3x.png", "");
    });
  return Array.from(new Set(array));
};
const generate = () => {
  let properties = imageFileNames()
    .map(name => {
      return `${name}: require('./Images/${name}.png')`;
    })
    .join(",\n  ");
  const string = `const images = {
  ${properties}
}
export default images
`;
  fs.writeFileSync("../assets/images.js", string, "utf8");
};
generate();
