//Холст и его контекст

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//Поля ввода
const widthBox = document.getElementById("widthBox");
const heightBox = document.getElementById("heightBox");
const topBox = document.getElementById("topBox");
const leftBox = document.getElementById("leftBox");

const saveButton = document.getElementById("saveBtn");

var photo = new Image();

photo.addEventListener("load", function(){
    ctx.drawImage(photo, 0, 0);  
    console.log("Hi");
})

saveButton.addEventListener("click", function () { saveImage(); })



widthBox.addEventListener('change', OnChangeWidth, false);
heightBox.addEventListener('change', OnChangeHeight, false);
document.getElementById('files').addEventListener('change', onLoad , false);




//document.addEventListener("resize", function () { OnResize(); });



//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

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


function OnChangeWidth() {
    canvas.width = widthBox.value;
}

function OnChangeHeight() {
    canvas.height = heightBox.value;
}

function RotateRight() {
	ctx.rotate(inRad(90));
	
}

function inRad(num) {
	//я ведь говорил, что функция принимает угол в радианах?
	return num * Math.PI / 180;
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