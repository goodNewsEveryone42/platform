const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pathToElements = path.resolve('src/elements');
const stylesPath = glob.sync(`${pathToElements}/**/*.?(svg|sass|scss|css)`);

const filterPath = stylesPath.filter(item => !item.includes('stories'));

filterPath.forEach(item => {
  if (!item) {
    return;
  }

  const [, target] = item.split('/elements');
  const fileDirectory = path.dirname(target);
  const fileDirectories = fileDirectory.split('/');

  let currentDirectory = path.resolve('./lib');

  fileDirectories.forEach(directory => {
    currentDirectory = path.resolve(currentDirectory, directory);

    if (!fs.existsSync(currentDirectory)) {
      fs.mkdirSync(currentDirectory);
    }
  });

  fs.copyFileSync(item, path.resolve(`./lib/${target}`));

  const fileContent = fs.readFileSync(path.resolve(`./lib/${target}`), 'utf8');

  const withReplacedAliases = fileContent.replace(
    /@wildberries\/ui-kit/g,
    `..${fileDirectory
      .replace(/[a-z-_]+\//g, '../')
      .replace(/\/[a-z-_]+/g, '')}`,
  );

  fs.writeFileSync(
    path.resolve(`./lib/${target}`),
    withReplacedAliases,
    'utf8',
  );
});
