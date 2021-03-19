const fse = require('fs-extra');
const path = require('path');

module.exports = async (entryPath, outputPath, outputFilename) => {

  // copying of 'app-config.js'
  {
    let filename = 'app-config.js';
    try {
      await fse.copyFile(path.join(entryPath, filename), path.join(outputPath, filename));
      console.log(`${filename} was copied to ${outputPath}`);
    } catch(err) {
      console.error(`copying of ${filename} was failed =>`, err);
      throw err;
    }
  }

  // creating-copying of 'package.json'
  {
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
      main: outputFilename,
      author,
      license,
      dependencies
    };

    filename = 'package.json';

    try{
      await fse.writeFile(
        path.join(outputPath, filename),
        JSON.stringify(newPackageJson, null, '  '),
        'utf8');
      console.log(`${filename} was copied to ${outputPath}`);
    } catch(err) {
      console.error(`copying of ${filename} was failed =>`, err);
    }
  }

  // copying of 'msnodesqlv8' package
  {
    const packageName = 'msnodesqlv8';
    const packageSrcPath = path.join(process.cwd(), 'node_modules', packageName);
    const packageDestPath = path.join(outputPath, 'node_modules', packageName);
    try{
      await fse.copy(packageSrcPath, packageDestPath);
      console.log(`package \"${packageName}\" was copied to ${outputPath}`);
    } catch(err) {
      console.error(`copying of package \"${packageName}\"${filename} was failed =>`, err);
      throw err;
    }
  }

}

// module.exports(path.join(__dirname, 'src'), path.join(process.cwd(), 'dist'));
