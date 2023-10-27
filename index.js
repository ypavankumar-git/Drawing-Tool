const canvas = document.querySelector("canvas")
const tools = document.querySelectorAll(".tool")
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll('.colors .option');
const colorPicker = document.querySelector('#color-picker');
const clearCanvasBtn = document.querySelector('.clear-canvas');
const saveImgbtn = document.querySelector(".save-img");
ctx = canvas.getContext("2d")

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener('load', () => {
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;
    setCanvasBackground();
})
let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let selectedColor = "#000";
let brushWidth = 5;

const drawToggle = (e) => {
    isDrawing = !isDrawing;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0,0,canvas.width, canvas.height);
}

tools.forEach(tool => {
    tool.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        tool.classList.add("active");
        selectedTool = tool.id;
})
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
    });
});
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
})
clearCanvasBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
})
saveImgbtn.addEventListener("click", () =>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

const drawRectangle = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY- e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const draw = (e) => {
    if(!isDrawing) return; 
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
    else if(selectedTool === "rectangle"){
        drawRectangle(e);
    }
    else if(selectedTool === "circle"){
        drawCircle(e);
    }
    else if(selectedTool === "triangle"){
        drawTriangle(e);
    }
}

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", drawToggle);
canvas.addEventListener("mouseup", () => isDrawing = false);
