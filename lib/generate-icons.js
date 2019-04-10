#!/usr/bin/env node

const fs = require("fs");
const glob = require("glob");
const uppercamelcase = require("uppercamelcase");
const camelcase = require("camelcase");
const path = require("path");
const cheerio = require("cheerio");
const program = require("commander");
const pkg = require("../package.json");
const ejs = require("ejs");

/**
 * CLI interface
 */

async function cli() {
  program
    .name("generate-react-icons")
    .version(pkg.version)
    .option("-s, --source <path>", "Path to the svg icons source")
    .option("-t, --template [path]", "Path to react component template")
    .option("--typescript", "Generate typescript icons")
    .option(
      "-d, --destination [path]",
      "Destination path for the react components"
    )
    .parse(process.argv);

  const destination = normalizePath(program.destination);
  const template = getTemplatePath(program.template, typescript);

  await generateIcons({
    ...program,
    destination,
    source: normalizePath(program.source),
    template
  });

  console.log("exported icons to " + destination);
}

module.exports = cli;

/**
 * Get the path of the template being used. Either use
 * a supplied custom template, the typescript template,
 * or the standard es6 javascript one
 *
 * @param {*} providedPath
 * @param {*} typescript
 */

function getTemplatePath(providedPath, typescript) {
  if (providedPath) {
    return normalizePath(providedPath);
  }

  if (typescript) {
    return path.join(__dirname, "default-ts.template.js");
  }

  return path.join(__dirname, "default-js-template.js");
}

/**
 * Normalize paths relative to working directory
 * @param {*} path
 */

function normalizePath(path) {
  return path.join(__dirname, path);
}

/**
 * Generate react components and index files
 * @param {*} param0
 */

async function generateIcons({ source, template, destination, typescript }) {
  const ext = typescript ? ".tsx" : ".js";

  glob(source, (err, icons) => {
    if (err) {
      throw err;
    }

    if (icons.length === 0) {
      throw Error(
        "Unable to find any icons. Make sure you use a glob format. [path/**.svg]"
      );
    }

    fs.writeFileSync(path.join(destination, `index${ext}`), "", "utf-8");
    const ejsTemplate = fs.readFileSync(template, "utf8");

    icons.forEach(iconPath => {
      const svg = fs.readFileSync(iconPath, "utf-8");
      const iconName = path.basename(iconPath, path.extname(iconPath));
      const componentName = "Icon" + uppercamelcase(iconName);

      const $ = cheerio.load(svg, { xmlMode: true });

      const iconDestination = path.join(
        destination,
        "icons",
        componentName + ext
      );

      // normalize the icon. This code is based on code found in react-icons
      // and react-feather.

      $("*").each((_, el) => {
        Object.keys(el.attribs).forEach(x => {
          if (x.includes("-")) {
            $(el)
              .attr(camelcase(x), el.attribs[x])
              .removeAttr(x);
          }

          if (x === "class") {
            $(el).removeAttr("class");
          }

          if (x === "stroke") {
            $(el).attr(x, "currentColor");
          }

          if (el.name === "svg") {
            $(el)
              .attr("other", "...")
              .removeAttr("width")
              .attr("height", 24)
              .attr("xmlns", 24);
          }
        });
      });

      const svgString = $("svg")
        .toString()
        .replace('stroke="currentColor"', "stroke={stroke}")
        .replace('width="24"', "width={size}")
        .replace('height="24"', "height={size}")
        .replace('other="...', "{...other}");

      const generatedFile = ejs.render(ejsTemplate, {
        svg: svgString,
        componentName
      });

      fs.writeFileSync(iconDestination, generatedFile, "utf8");

      // append the export statement to the index file
      const exportString = `export * from './icons/${componentName}${ext};\r\n`;

      fs.appendFileSync(
        path.join(destination, `index${typescript ? ".ts" : ".js"}`),
        exportString,
        "utf-8"
      );
    });
  });
}
