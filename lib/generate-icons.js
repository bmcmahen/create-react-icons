#!/usr/bin/env node

const fs = require("fs");
const glob = require("glob");
const uppercamelcase = require("uppercamelcase");
const camelcase = require("camelcase");
const path = require("path");
const cheerio = require("cheerio");
const program = require("commander");
const pkg = require("../package.json");
const prettier = require("prettier");
const mkdirp = require("mkdirp");
const ejs = require("ejs");
const chalk = require("chalk");

/**
 * CLI interface
 */

async function cli() {
  program
    .name("create-react-icons")
    .version(pkg.version)
    .option(
      "-s, --source <path>",
      "Path to the svg icon source ('./path/**.svg')"
    )
    .option(
      "-d, --destination <path>",
      "Destination path for the generated react components (./path/destination)"
    )
    .option(
      "-t, --template <path>",
      "Path to the ejs react component template (./path/template.ejs)"
    )
    .option("--typescript", "Generate typescript icons")

    .parse(process.argv);

  if (!program.destination) {
    console.log(
      chalk.red("create-react-icons must be initialized with a destination")
    );
    program.help();
    process.exit(1);
  }

  if (!program.source) {
    console.log(
      chalk.red("create-react-icons must be initialized with a source")
    );
    program.help();
    process.exit(1);
  }

  const destination = normalizePath(program.destination);
  const template = getTemplatePath(program.template, program.typescript);
  const source = normalizePath(program.source);

  console.log(chalk.blue("source: ", source));
  console.log(chalk.blue("template: ", template));
  console.log(chalk.blue("destination: ", destination));

  await generateIcons({
    ...program,
    destination,
    source,
    template
  });

  console.log(chalk.green("Icons exported to: " + destination));
}

exports.cli = cli;

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
    return path.join(__dirname, "default-ts-template.ejs");
  }

  return path.join(__dirname, "default-js-template.ejs");
}

/**
 * Normalize paths relative to working directory
 * @param {*} path
 */

function normalizePath(p) {
  return path.join(process.cwd(), p);
}

/**
 * Generate react components and index files
 * @param {*} param0
 */

async function generateIcons({ source, template, destination, typescript }) {
  const ext = typescript ? ".tsx" : ".js";

  const indexFilePath = path.join(
    destination,
    `index${typescript ? ".ts" : ".js"}`
  );

  // make the directory
  const directory = path.parse(indexFilePath).dir;
  await mkdirp(directory);

  // make the index file
  fs.writeFileSync(indexFilePath, "", "utf-8");

  // make the icon folder
  await mkdirp(path.join(destination, "icons"));

  // read the icon source
  glob(source, (err, icons) => {
    if (err) {
      throw err;
    }

    if (icons.length === 0) {
      throw Error(
        "Unable to find any icons. Make sure you use a glob format. [path/**.svg]"
      );
    }

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

          if (x.includes(":")) {
            $(el).removeAttr(x);
          }

          if (x === "class") {
            $(el).removeAttr("class");
          }

          if (x === "fill") {
            const val = $(el).attr(x);
            if (val !== "none") {
              $(el).attr(x, "currentColor");
            }
          }

          if (x === "stroke") {
            const val = $(el).attr(x);
            if (val !== "none") {
              $(el).attr(x, "currentColor");
            }
          }
        });

        if (el.name === "svg") {
          $(el)
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("xmlns")
            .attr("height", 24)
            .attr("width", 24)
            .attr("other", "...");
        }
      });

      const svgString = $("svg")
        .toString()
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(new RegExp('stroke="currentColor"', "g"), "stroke={color}")
        .replace(new RegExp('fill="currentColor"', "g"), "fill={color}")
        .replace('width="24"', "width={size}")
        .replace('height="24"', "height={size}")
        .replace('other="..."', "{...other}");

      const generatedFile = prettier.format(
        ejs.render(ejsTemplate, {
          svg: svgString,
          componentName
        }),
        {
          parser: typescript ? "typescript" : "babel"
        }
      );

      fs.writeFileSync(iconDestination, generatedFile, "utf8");

      // append the export statement to the index file
      const exportString = `export * from "./icons/${componentName}";\r\n`;

      fs.appendFileSync(
        path.join(destination, `index${typescript ? ".ts" : ".js"}`),
        exportString,
        "utf-8"
      );
    });
  });
}

exports.generateIcons = generateIcons;
