const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveCanvas = document.querySelector(".save-img"),
ctx = canvas.getContext("2d")

// global variable with default value
let prevMouseX , prevMouseY, snapshots,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000"

const setCanvasBg = () => {
    // Setting whole canvas background to white , so the download img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor   // Setting fillstyle back to the selectedColor , It will be the brush color
}

window.addEventListener("load", () => {
    // Setting canvas width / Heigth .. offsetwidthheigth return viewable width/heigth of the element
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBg()
})

const drawRect = (eve) => {
    // If fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked){
        // Creating rectangle according to the mouse pointer
        return ctx.strokeRect(eve.offsetX, eve.offsetY, prevMouseX - eve.offsetX, prevMouseY - eve.offsetY)
    }
    ctx.fillRect(eve.offsetX, eve.offsetY, prevMouseX - eve.offsetX, prevMouseY - eve.offsetY)
}

const drawCircle = (eve) => {
    ctx.beginPath()  // Creating New path to draw circle
    // getting the radius of circle According to the Mouse Pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - eve.offsetX), 2) + Math.pow((prevMouseY - eve.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)  // Creating Circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke()  // if Fill color is checked fill circle else draw border circle
}

const drawLine = (eve) => {
    ctx.beginPath()  // Creating New path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY) // moving triangle to the mouse pointer
    ctx.lineTo(eve.offsetX, eve.offsetY)  // Creating First Line According to the mouse pointer
    ctx.stroke()
}

const drawTriangle = (eve) => {
    ctx.beginPath()  // Creating New path to draw Triangle
    ctx.moveTo(prevMouseX, prevMouseY) // moving triangle to the mouse pointer
    ctx.lineTo(eve.offsetX, eve.offsetY)  // Creating First Line According to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - eve.offsetX, eve.offsetY)  // Creating bottom line of triangle
    ctx.closePath()  // Closing the Part Of triangle So the Third line Draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke()  // if Fill color is checked fill Triangle else draw border Triangle
}

const startDrawing = (eve) => {
    isDrawing = true
    prevMouseX = eve.offsetX  // passing current mouseX position as the prevMouseX value
    prevMouseY = eve.offsetY  // passing current mouseY position as the prevMouseY value

    ctx.beginPath()  // Creating New path to draw
    ctx.lineWidth = brushWidth;  // Passing brush Size As linewidth

    // Passing selectedColor as Stroke And Fill Style
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor

    // copying the canvas data & passing as the snapshots value.. this avoid dragging the images
    snapshots = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (eve) => {
    if(!isDrawing) return  // if isDrawing is false return from here
    ctx.putImageData(snapshots, 0, 0)  // adding copied canvas data onthis canvas

    if(selectedTool === "brush" || selectedTool === "eraser"){
        // If selected tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
        ctx.lineTo(eve.offsetX, eve.offsetY)  // Creating line according to the mouse Pointer
        ctx.stroke()  // Drawing / Filling lines with color
    } else if(selectedTool === "rectangle") {
        drawRect(eve)
    } else if(selectedTool === "circle") {
        drawCircle(eve)
    } else if(selectedTool === "line"){
        drawLine(eve)
    } else {
        drawTriangle(eve)
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active")
        btn.classList.add("active")
        selectedTool = btn.id
    })
})

sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value   // Passing slider value as the brushSize
})

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {  // adding click Event to all Color Button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected")
        btn.classList.add("selected")
        // Passing selected Btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})

colorPicker.addEventListener("change", () => {
    // Passing Picked Color Value From Color Picker to last color btn background 
    colorPicker.parentElement.style.background = colorPicker.value
    colorPicker.parentElement.click()
})

clearCanvas.addEventListener("click", () => {
    // Clearing Whole Canvas
    ctx.clearRect(0, 0, canvas.width,canvas.height)  
    setCanvasBg() 
})

saveCanvas.addEventListener("click", () => {
    const link = document.createElement("a")  // Creating and <a></a> element
    link.download = `${Date.now()}.jpg`  // Passing current date as link download value - in short file download name
    link.href = canvas.toDataURL()  // Passing canvasData as link href value.
    link.click()  // clicking link to download image
})

canvas.addEventListener("mousedown", startDrawing)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => isDrawing = false);
