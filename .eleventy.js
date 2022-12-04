const yaml = require("js-yaml");

module.exports = eleventyConfig => {
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  eleventyConfig.addShortcode("twitter", function (username) {
    return `<a href="https://www.twitter.com/${username}">${username}</a>`;
  });
};
