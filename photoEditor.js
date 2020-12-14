class Info {
    constructor(name, fun) {
        this.name = name;
        this.fun = fun;
    }
}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dragAndDropArea = document.getElementById("drop-area");

const widthBox = document.getElementById("widthBox");
const heightBox = document.getElementById("heightBox");

const panel = document.getElementById("panel");

const selector = document.getElementById("selector");

const saveButton = document.getElementById("save");

const filterList = document.getElementById("ulList");

const file = document.getElementById("file");

var binarizeValue = 100;

const list = [];

canvas.width = 0;
canvas.height = 0;

var startWidth;
var startHeight;

var first = true;

var mainIndex = 0;

const infoAboutFilters = [
    new Info("Turn left", RotateLeft),
    new Info("Turn right", RotateRight),
    new Info("Flip vertical", FlipVertically),
    new Info("Flip horizontal", FlipHorizontally),
    new Info("White-black", removeColors),
    new Info("Binarize", Binarize)
];

var startImage = new Image();
var photo = new Image();
var newPhoto = new Image();

var filters = [];

var oCanvas = document.createElement('canvas');
var oCtx = oCanvas.getContext('2d');

canvas.hidden = true;
var startPositionOfPanel = panel.style.bottom;

newPhoto.onload = function () {         
    photo = newPhoto;          
    mainIndex = mainIndex + 1;    
    InitList();
}

photo.addEventListener("load", onPhotoLoaded);

selector.addEventListener("change", function () { SelectFilter(); });
panel.addEventListener("mouseenter", function () { OpenPanel(); });
panel.addEventListener("mouseleave", function () { ClosePanel(); });
dragAndDropArea.ondragover = function (event) {
    event.dataTransfer.dropEffect = "move"
    event.returnValue = false;
    return;
} 
dragAndDropArea.ondrop = DropFile;
saveButton.addEventListener("click", function () { saveImage(); });
widthBox.addEventListener('change', OnChangeRect, false);
heightBox.addEventListener('change', OnChangeRect, false);
file.addEventListener('input', onLoad, false);
canvas.addEventListener('change', function () { console.log("CH"); });

function DrawPic() {
    ctx.drawImage(photo, 0, 0, widthBox.value, heightBox.value);
}

function onPhotoLoaded() {
    console.log('1');
    dragAndDropArea.hidden = true;         
    SetRectValues(photo.width, photo.height);
    AssignCanvasRectValues();
    startWidth = canvas.width;
    startHeight = canvas.height;    
    DrawPic(); 
    photo.removeEventListener("load", onPhotoLoaded);
}

function onLoad(e) {
    
    var files = e.target.files;
    var file = files[0];

    Load(file);  
}
function Load(file) {
    var fileReader = new FileReader();
    
    photo.addEventListener("load", onPhotoLoaded);
    fileReader.onload = (function (file) {

        return function (e) {
            startImage.src = fileReader.result;
            photo.src = fileReader.result;
        };

    })(file);

    if (file) {
        fileReader.readAsDataURL(file);        
    }
}
function DropFile(e) {
    event.dataTransfer.dropEffect = "move"
    var files = e.dataTransfer.files;
    event.returnValue = false;    
    Load(files[0]); 
}
function SelectFilter() {        
    CreateNewFilter(selector.selectedIndex-1);
    selector.selectedIndex = 0;
}
function CreateNewFilter(index) {
    var filterInfo = infoAboutFilters[index];
    var el = '';
    if (index == 5) {
        el = '<div class="filterContainer" id='+index+'><p style = "margin:0px;" >' + filterInfo.name + '</p> <p style="margin:2px; font-size: 12px;"> Value: &nbsp;<input type="number" id="value" value="100" min="0" max="255" style = "font-size: 12px;"> </p><div class="close" id ="close"> </div> </div>'
    }
    else {
        el = '<div class="filterContainer" id=' + index +'> <p style = "margin:5px;" >' + filterInfo.name + '</p >   <div class="close" id ="close">  </div> </div>';
    }
    filterList.innerHTML += el;    
    document.querySelectorAll('.close').forEach(item => {
        item.addEventListener('click', CloseElement)
    })   
    InitList();               
}
function changeBinarValue(e) {

    binarizeValue = e.target.value;   
    
    InitList();
    
}
function InitList() {    
    
    if (mainIndex == 0) {                
        photo.src = startImage.src;         
        canvas.width = startWidth;
        canvas.height = startHeight;
        SetRectValues(startWidth, startHeight);
    }
    
    if (mainIndex < filterList.children.length) {        
        var number = filterList.children[mainIndex].getAttribute("id");        
        infoAboutFilters[number].fun();
    }
    else {        
        
        mainIndex = 0;         
        var bivValue = document.getElementById("value");
        if (bivValue != null) {
            bivValue.value = binarizeValue;
            bivValue.onchange = changeBinarValue;
        }
        else {
            binarizeValue = 100;
        }
        
        DrawPic();
    }
    
}
function CloseElement(e) {  
    filterList.removeChild(e.target.parentElement);      
    InitList();
}
function OpenPanel() {
    
    panel.style.bottom = 0;
}
function ClosePanel() {
    
    panel.style.bottom = startPositionOfPanel;
}
function SetRectValues(width, height) {
    widthBox.value = width;
    heightBox.value = height;

}

function OnChangeRect() {
    AssignCanvasRectValues();  
    DrawPic();
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
    SetRectValues(canvas.height, canvas.width);    
    AssignNewCanvas();
    AssignCanvasRectValues();    
    
    
    oCtx.rotate(inRad(-90));
    oCtx.translate(-oCanvas.height, 0);   
    oCtx.drawImage(photo, 0, 0, widthBox.value, heightBox.value); 
    
    newPhoto.src = oCanvas.toDataURL("image/jpeg"); 
    
    
}
function RotateRight() {
    SetRectValues(canvas.height, canvas.width);
    AssignNewCanvas();    
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

function Binarize() {
   
    Binarization(binarizeValue);
}

function removeColors() {
    AssignNewCanvas();    
    var oColorImg = photo;    
    oCtx.drawImage(oColorImg, 0, 0, widthBox.value, heightBox.value);
    var oImgData = oCtx.getImageData(0, 0, widthBox.value, heightBox.value);
    var aPix = oImgData.data;
    var nPixLen = aPix.length;
    for (nPixel = 0; nPixel < nPixLen; nPixel += 4) {
        aPix[nPixel + 2] = aPix[nPixel + 1] = aPix[nPixel] = (aPix[nPixel] + aPix[nPixel + 1] + aPix[nPixel + 2]) / 3;
    }
    oCtx.putImageData(oImgData, 0, 0);    
    newPhoto.src = oCanvas.toDataURL();
}

    
function Binarization(threshold) {
    var im = photo;
    AssignNewCanvas();
    oCtx.drawImage(im, 0, 0, widthBox.value, heightBox.value);
    var imData = oCtx.getImageData(0, 0, oCanvas.width, oCanvas.height)
        , histogram = Array(256)
        , i
        , red
        , green
        , blue
        , gray;
    for (i = 0; i < 256; ++i)
        histogram[i] = 0;
    for (i = 0; i < imData.data.length; i += 4) {
        red = imData.data[i];
        blue = imData.data[i + 1];
        green = imData.data[i + 2];
        
        gray = red * .2126 + green * .7152 + blue * .0722;
        histogram[Math.round(gray)] += 1;
    }    
    
    for (i = 0; i < imData.data.length; i += 4) {
        imData.data[i] = imData.data[i + 1] = imData.data[i + 2] =
            imData.data[i] >= threshold ? 255 : 0;
        
        imData.data[i + 3] = 255;
    }
    oCtx.putImageData(imData, 0, 0);  
    newPhoto.src = oCanvas.toDataURL("image/jpeg");  
}
function inRad(num) {
    return num * Math.PI / 180;
}