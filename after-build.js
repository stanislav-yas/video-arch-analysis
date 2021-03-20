const fse = require('fs-extra');
const path = require('path');

module.exports = async (entryPath, outputPath, outputFileName) => {

  // copying of 'app.config.js'
  let fileName = 'app.config.js';
  let fileSrcPath = path.join(entryPath, '../', fileName);
  let fileDestPath = path.join(outputPath, '../', fileName);
  try {
    await fse.copyFile(fileSrcPath, fileDestPath);
    console.log(`${fileName} was copied to ${fileDestPath}`);
  } catch(err) {
    console.error(`copying of ${fileName} was failed =>`, err);
    throw err;
  }

  // creating-copying of 'package.json'
  const {
    name,
    version,
    description,
    author,
    license,
    dependencies
  } = require('./package.json');

  const newPackageJson = {
    name,
    version,
    description,
    main: `cli/${outputFileName}`,
    scripts: {
      "start": "node cli"
    },
    author,
    license,
    dependencies
  };

  fileName = 'package.json';
  fileDestPath = path.join(outputPath, '../', fileName);
  try{
    await fse.writeFile(
      fileDestPath,
      JSON.stringify(newPackageJson, null, '  '),
      'utf8');
    console.log(`${fileName} was copied to ${fileDestPath}`);
  } catch(err) {
    console.error(`copying of ${fileName} was failed =>`, err);
  }

  // copying of 'msnodesqlv8' package
  const packageName = 'msnodesqlv8';
  const packageSrcPath = path.join(process.cwd(), 'node_modules', packageName);
  const packageDestPath = path.join(outputPath, 'node_modules', packageName);
  try{
    await fse.copy(packageSrcPath, packageDestPath);
    console.log(`package \"${packageName}\" was copied to ${packageDestPath}`);
  } catch(err) {
    console.error(`copying of package \"${packageName}\" was failed =>`, err);
    throw err;
  }
}

// module.exports(path.join(__dirname, 'src'), path.join(process.cwd(), 'dist'));
