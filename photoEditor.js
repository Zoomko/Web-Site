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

const saveButton = document.getElementById("saveBtn");

const filterList = document.getElementById("ulList");

const list = [];

var mainIndex = 0;

const infoAboutFilters = [
    new Info("Turn left", RotateLeft),
    new Info("Turn right", RotateRight),
    new Info("Flip vertical", FlipVertically),
    new Info("Flip horizontal", FlipVertically),
    new Info("White-black", removeColors),
    new Info("Binarize", Binarize)
];

var startImage = new Image();
var photo = new Image();
var newPhoto = new Image();

var filters = [];

var oCanvas;
var oCtx;

canvas.hidden = true;
var startPositionOfPanel = panel.style.bottom;

newPhoto.onload = function () {    
    photo = newPhoto;     
    Draw();
    mainIndex = mainIndex + 1;
    InitList();
}

photo.addEventListener("load", function () {
    dragAndDropArea.hidden = true;
    canvas.hidden = false;
    SetRectValues(photo.width, photo.height);
    AssignCanvasRectValues();
    Draw();   

});

selector.addEventListener("change", function () { SelectFilter(); });
panel.addEventListener("mouseenter", function () { OpenPanel(); });
panel.addEventListener("mouseleave", function () { ClosePanel(); });
//saveButton.addEventListener("click", function () { saveImage(); });
widthBox.addEventListener('change', OnChangeRect, false);
heightBox.addEventListener('change', OnChangeRect, false);
document.getElementById('files').addEventListener('change', onLoad , false);



function onLoad(e) {
    
    var files = e.target.files;
    var file = files[0];

    
    var fileReader = new FileReader();
    

    fileReader.onload = (function (file) {

        return function (e) {            
            startImage.src = fileReader.result;  
            photo.src= fileReader.result;
        };

    })(file);

    if (file) {
        fileReader.readAsDataURL(file);
    } else {
        photo.src = "";
    }   
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
    InitList();
    //var last = filterList.lastElementChild;    
    //var closeEl = last.getElementsByClassName("close")[0];   
    //var filter = new Filter(index, last, closeEl);
    document.querySelectorAll('.close').forEach(item => {
        item.addEventListener('click', CloseElement)
        })  
    //filters.push(filter);        
}
function InitList() {    
    if (mainIndex == 0) {
        photo.src = startImage.src;
    }
    if (mainIndex < filterList.children.length) {
        console.log("true");
        var number = filterList.children[mainIndex].getAttribute("id");
        infoAboutFilters[number].fun();
    }
    else
        mainIndex = 0;    
    
}
function CloseElement(e) {  
    filterList.removeChild(e.target.parentElement);      
    InitList();
}
function OpenPanel() {
    console.log("Open");
    panel.style.bottom = 0;
}
function ClosePanel() {
    console.log("Close");
    panel.style.bottom = startPositionOfPanel;
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

function Binarize() {
   
    Binarization(120);
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
    oCtx.drawImage(im, 0, 0);
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
    console.log("threshold =%s", threshold);
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