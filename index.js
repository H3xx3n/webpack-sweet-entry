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
  const filteredPaths = options.useUnderscoreFiles
    ? globpaths
    : dropUnderscoreFiles(globpaths);
  if (options.keyName) {
    return { [(options.basedir || "") + options.keyName]: filteredPaths.map(e => path.resolve(e)) };
  }
  let ret = {};
  filteredPaths.forEach(p => {
    let key = (options.basedir || "") +
      splitString(p, `/${options.parentdir}/`)
      .slice(-1)[0];
    key = key.replace(path.extname(key), "");
    ret[key] = path.resolve(p);
  });

  return ret;
}

module.exports = toObject;
