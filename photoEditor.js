
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const widthBox = document.getElementById("widthBox");
const heightBox = document.getElementById("heightBox");
const topBox = document.getElementById("topBox");
const leftBox = document.getElementById("leftBox");

const leftButton = document.getElementById("rotateLeftButton");
const rightButton = document.getElementById("rotateRightButton");
const flipVerticallyButton = document.getElementById("flipVerticallyButton");
const flipHorizontallyButton = document.getElementById("flipHorizontallyButton");

const saveButton = document.getElementById("saveBtn");

var photo = new Image();
var newPhoto = new Image();

var filters = new Map();

var oCanvas;
var oCtx;

newPhoto.onload = function () {    
    photo = newPhoto;     
    Draw();
}
photo.addEventListener("load", function () {

    SetRectValues(photo.width, photo.height);
    AssignCanvasRectValues();
    Draw();   

});

flipVerticallyButton.addEventListener("click", function () { FlipVertically(); });
flipHorizontallyButton.addEventListener("click", function () { FlipHorizontally(); });
rightButton.addEventListener("click", function () { RotateRight(); });
leftButton.addEventListener("click", function () { RotateLeft(); });
saveButton.addEventListener("click", function () { saveImage(); });
widthBox.addEventListener('change', OnChangeRect, false);
heightBox.addEventListener('change', OnChangeRect, false);
document.getElementById('files').addEventListener('change', onLoad , false);



function onLoad(e) {
    
    var files = e.target.files;
    var file = files[0];

    
    var fileReader = new FileReader();
    

    fileReader.onload = (function (file) {

        return function (e) {            
            photo.src = fileReader.result;            
        };

    })(file);

    if (file) {
        fileReader.readAsDataURL(file);
    } else {
        photo.src = "";
    }

    
    
}

function SetRectValues(width, height) {
    widthBox.value = width;
    heightBox.value = height;

}

function Draw() {
    ctx.drawImage(photo, 0, 0, widthBox.value, heightBox.value);
}

function OnChangeRect() {
    AssignCanvasRectValues();  
    Draw();
}

function AssignCanvasRectValues() {
    canvas.height = heightBox.value;
    canvas.width = widthBox.value;   
}
function AssignNewCanvas() {
    oCanvas = document.createElement('canvas');
    oCtx = oCanvas.getContext('2d');
    oCanvas.width = canvas.width;
    oCanvas.height = canvas.height;
}
function RotateLeft() { 
   
    AssignNewCanvas();
    SetRectValues(canvas.height, canvas.width);
    AssignCanvasRectValues();    
    oCtx.rotate(inRad(-90));
    oCtx.translate(-oCanvas.height, 0);   
    oCtx.drawImage(photo, 0, 0, widthBox.value, heightBox.value); 
    newPhoto.src = oCanvas.toDataURL("image/jpeg"); 
    
}
function RotateRight() {
    AssignNewCanvas();
    SetRectValues(canvas.height, canvas.width);
    AssignCanvasRectValues();
    oCtx.rotate(inRad(90));
    oCtx.translate(0,-oCanvas.width);
    oCtx.drawImage(photo, 0, 0, widthBox.value, heightBox.value);
    newPhoto.src = oCanvas.toDataURL("image/jpeg");    
}

function FlipVertically()
{
    AssignNewCanvas();
    oCtx.scale(1, -1);
    oCtx.translate(0, -oCanvas.height);
    oCtx.drawImage(photo, 0, 0, widthBox.value, heightBox.value);
    newPhoto.src = oCanvas.toDataURL("image/jpeg");  
}

function FlipHorizontally()
{
    AssignNewCanvas();
    oCtx.scale(-1, 1);
    oCtx.translate(-oCanvas.width, 0);
    oCtx.drawImage(photo, 0, 0, widthBox.value, heightBox.value);
    newPhoto.src = oCanvas.toDataURL("image/jpeg");  
}

function saveImage() {
	
	var dataURL = canvas.toDataURL("image/jpeg");
	var link = document.createElement("a");
	document.body.appendChild(link); // Firefox requires the link to be in the body :(
	
	link.href = dataURL;	
	link.download = "my-image-name.jpg";
	link.click();

	document.body.removeChild(link);

}



function removeColors() {
    var aImages = document.getElementsByClassName('grayscale'),
        nImgsLen = aImages.length,
        oCanvas = document.createElement('canvas'),
        oCtx = oCanvas.getContext('2d');
    for (var nWidth, nHeight, oImgData, oGrayImg, nPixel, aPix, nPixLen, nImgId = 0; nImgId < nImgsLen; nImgId++) {
        oColorImg = aImages[nImgId];
        nWidth = oColorImg.offsetWidth;
        nHeight = oColorImg.offsetHeight;
        oCanvas.width = nWidth;
        oCanvas.height = nHeight;
        oCtx.drawImage(oColorImg, 0, 0);
        oImgData = oCtx.getImageData(0, 0, nWidth, nHeight);
        aPix = oImgData.data;
        nPixLen = aPix.length;
        for (nPixel = 0; nPixel < nPixLen; nPixel += 4) {
            aPix[nPixel + 2] = aPix[nPixel + 1] = aPix[nPixel] = (aPix[nPixel] + aPix[nPixel + 1] + aPix[nPixel + 2]) / 3;
        }
        oCtx.putImageData(oImgData, 0, 0);
        oGrayImg = new Image();
        oGrayImg.src = oCanvas.toDataURL();
        oGrayImg.onmouseover = showColorImg;
        oColorImg.onmouseout = showGrayImg;
        oCtx.clearRect(0, 0, nWidth, nHeight);
        oColorImg.style.display = "none";
        oColorImg.parentNode.insertBefore(oGrayImg, oColorImg);
    }

}

function inRad(num) {
    return num * Math.PI / 180;
}