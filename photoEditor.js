//Холст и его контекст
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Поля ввода
const widthBox = document.getElementById("widthBox");
const heightBox = document.getElementById("heightBox");
const topBox = document.getElementById("topBox");
const leftBox = document.getElementById("leftBox");

//Кнопка сохранения
const saveBtn = document.getElementById("saveBtn");

//Ссылка на новое изображение
const newImg = document.getElementById("newImg");