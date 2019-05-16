"use strict";
const csv = require("csv");
const fs = require("fs");
const fastGlob = require("fast-glob");
/**
 * List files from glob
 */
function ls(glob) {
  return fastGlob.async(glob);
}

/**
 * Alias of console.log
 */
function print(...params) {
  console.log(...params); // eslint-disable-line
}

/**
 * CSV Parse
 */
function csvParse(input, options) {
  return new Promise((resolve, reject) => {
    csv.parse(input, options, (error, output) => {
      if (error) {
        reject(error);
      } else {
        resolve(output);
      }
    });
  });
}

/**
 * Read file contents
 */
function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, { encoding: "utf8" }, (err, buffer) => {
      if (err) reject(err);
      else resolve(buffer);
    });
  });
}

/**
 * Parse CSV from file path
 */
async function readCsv(filename, options) {
  const text = await readFile(filename);
  return csvParse(text, options || {});
}

module.exports = {
  csvParse,
  ls,
  print,
  readCsv,
  readFile,
};
