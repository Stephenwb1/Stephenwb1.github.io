//Select input and preview elements

const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas")
const submitButton = document.getElementById('submitButton');
const ctx = canvas.getContext("2d");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const asciiImage = document.getElementById("ascii");
const footer = document.getElementsByTagName("footer");

// The number of columns we'll use in our ascii image
const ramp = "@%#*+=-:. ";
const rampLength = ramp.length;

const MAXIMUM_WIDTH = 80;
const MAXIMUM_HEIGHT = 80;

//picks a character to use for a given pixel by looking at its brightness
const getCharForGrayscale = grayscale =>
    ramp[Math.ceil(((rampLength - 1) * grayscale) / 255)];

//used to convert the image to grayscale
const createGrayscale = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    //loop through every pixel (R, G, B, A)
    //convert to grayscale
    const grayScales = [];

    for(let i = 0; i < data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i+1];
        const b = imageData.data[i+2];

        const grayScale = (0.21*r + 0.72*g + 0.07*b);

        grayScales.push(grayScale);
    }

    
    //we need to split the image into M x N tiles (row x column)

    ctx.putImageData(imageData, 0, 0);

    return grayScales;
};

//Gets the font ratio
const getFontRatio = () => {
    const pre = document.createElement("pre");
    pre.style.display = "inline";
    pre.textContent = " ";

    document.body.appendChild(pre);
    const {width, height} = pre.getBoundingClientRect();
    document.body.removeChild(pre);

    return height / width;
};

//resizes the image so it isnt too big
const clampDimensions = (width, height) => {
    const recitifiedWidth = Math.floor(getFontRatio() * width);

    if (height > MAXIMUM_HEIGHT) {
        const reducedWidth = Math.floor(recitifiedWidth * MAXIMUM_HEIGHT / height);
        return [reducedWidth, MAXIMUM_HEIGHT];
    }

    if (width > MAXIMUM_WIDTH) {
        const reducedHeight = Math.floor(height * MAXIMUM_WIDTH / recitifiedWidth);
        return [MAXIMUM_WIDTH, reducedHeight];
    }

    return [recitifiedWidth, height];
};

//draws the final ascii image
const drawAscii = (grayScales, width) => {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharForGrayscale(grayScale);
        if ((index+1) % width === 0) {
            nextChars += "\n";
        }

        return asciiImage + nextChars;
    }, "");
    asciiImage.textContent = ascii;
};

//When an image is submitted
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];//gets the file
    if (!file.type.startsWith("image/")) {
        alert("The selected file is not an image.");
        return;
    }

    submitButton.style.display = "block";

    //what happens after the file is read
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            //set canvas size to match the image
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.style.display = "none";
            submitButton.style.display = "block";

            preview.src = img.src;
            preview.style.display = "block";

            ctx.drawImage(img, 0, 0);
        };

        /*preview.src = event.target.result; //sets the image source to the file content
        preview.style.display = 'block'; //make the image visible */
    };

    reader.readAsDataURL(file);

});

//When the submit button is clicked
submitButton.addEventListener("click", () => {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please insert an image.");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
            const [width, height] = clampDimensions(image.width, image.height);

            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(image, 0, 0, width, height);
            const grayScales = createGrayscale(ctx, width, height)

            preview.style.display = "none";

            //imageInput.style.display = "none";
            drawAscii(grayScales, width)
        }

        image.src = event.target.result;
    };

    footer1.style.display="block";
    ascii.style.display="block";
    reader.readAsDataURL(file);

});