const path = require("path");
const glob = require("glob");

function splitString(stringToSplit, separator) {
  return stringToSplit.split(separator);
}

function dropUnderscoreFiles(obj) {
  return obj.filter(e => e.substring(0, 1) !== "_" && !e.includes("/_"));
}

const defaultOptions = {
  paths: "",
  ext: "js",
  parentdir: "/",
  basedir: "",
  useUnderscoreFiles: false,
  keyName: ""
};

function toObject(props) {
  const options = { ...defaultOptions, ...props };
  const globpaths = glob.sync(options.paths);
  console.log(options.paths);
  console.log(options.parentdir);
  const filteredPaths = options.useUnderscoreFiles
    ? globpaths
    : dropUnderscoreFiles(globpaths);
  if (options.keyName) {
    return { [(options.basedir || "") + options.keyName]: filteredPaths };
  }
  let ret = {};
  filteredPaths.forEach(p => {
    let key = (options.basedir || "") +
      splitString(p, `/${options.parentdir}/`)
        .slice(-1)[0];
    key = key.replace(path.extname(key), "");
    ret[key] = p;
  });

  return ret;
}

module.exports = toObject;
