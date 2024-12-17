
const img = new Image();

img.src = "exammple.png";

img.onload = function() {
    const width = img.width;
    const height = img.height;

    console.log(`Width: ${width}, HeightL: ${height}`);
};

img.onerror = function() {
    console.error("Failed to load the image.");
};

let gscale = " .:-=+*#%@" // Reversed?

function getAverageBrightness(image) {

}
