const yaml = require("js-yaml");
const Image = require("@11ty/eleventy-img");

const TAGS = ['fun', 'serious', 'legacy', 'jenkins', 'muds'];

const toImageTag = async (src = 'src/img/noimage.jpg', alt = "", width = 300) => {
  if (!src) {
    src = "src/img/noimage.jpg";
  }

  let attributes = {
    src: src.replace('/assets/', 'src/img/'),
    widths: [width],
    alt: alt || "",
  }
  const imageOptions = {
    // We only need the original width and format
    widths: attributes.widths,
    formats: ['avif', 'jpeg'],
    // Where the generated image files get saved
    outputDir: '_site/assets/images',
    // Public URL path that's referenced in the img tag's src attribute
    urlPath: '/assets/images',
  };
  // generate images, while this is async we don’t wait
  let metadata = await Image(attributes.src, imageOptions);
  return Image.generateHTML(metadata, {
    sizes: '100vw',
    loading: 'lazy',
    decoding: 'async',
    ...attributes,
  });
};

module.exports = eleventyConfig => {
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("src/img/*.png");
  eleventyConfig.addPassthroughCopy('css')

  eleventyConfig.addAsyncShortcode('toImageTag', toImageTag)

  eleventyConfig.addFilter("toUpperCase", value => value.toUpperCase())

  eleventyConfig.addShortcode("twitter", function (username) {
    return `<a href="https://www.twitter.com/${username}">${username}</a>`;
  });

  TAGS.forEach(tag => {
    eleventyConfig.addCollection(tag + 'Projects', function (collectionApi) {
      return collectionApi.getAll().filter(item => item?.data?.tags?.includes(tag));
    })
  })
  eleventyConfig.addCollection('remainingProjects', function (collectionApi) {
    return collectionApi.getAll().filter(item => !TAGS.some(tag => item?.data?.tags?.includes(tag)));
  })

  return {
    dir: {
      input: "src",
    }
  }
};
