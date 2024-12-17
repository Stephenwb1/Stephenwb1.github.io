//Select input and preview elements

const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas")
const submitButton = document.getElementById('submitButton');
const ctx = canvas.getContext("2d");
const preview = document.getElementById("preview");
const result = document.getElementById("result")



imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];//gets the file
    if (!file.type.startsWith("image/")) {
        alert("The selected file is not an image.");
        return;
    }

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

            ctx.drawImage(img, 0, 0)
        };

        /*preview.src = event.target.result; //sets the image source to the file content
        preview.style.display = 'block'; //make the image visible */
    };

    reader.readAsDataURL(file);

    

});

submitButton.addEventListener("click", () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    //loop through every pixel (R, G, B, A)
    for(let i = 0; i < data.length; i += 4) {
        const grayscale = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];

        //set RGB to grayscale value
        data[i] = data[i + 1] = data[i + 2] = grayscale;
    }

    ctx.putImageData(imageData, 0, 0);

    result.src = canvas.toDataURL();
    result.style.display = "block";
});

//unused as of now
function createAscii(image) {
    //step one, convert to grayscale
    const reader = new FileReader();

    reader.onload = function(event) {
        result.src = event.target.result; //sets the image source to the file content
        result.style.display = 'block'; //make the image visible
    };

    

    reader.readAsDataURL(image);
}