const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let canvasImage;


const grid = [];
const gridSize = 40; // Size of each grid cell
const appleNumbers = [];


function initGrid() {
    ctx.fillStyle = '#d9f6cd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width / gridSize; x++) {
        for (let y = 0; y < canvas.height / gridSize; y++) {
            grid.push({ x: x * gridSize, y: y * gridSize});
        }
    }
}
initGrid();


//setup
function placeApples() {
    grid.forEach((cell, index) => {
        ctx.fillStyle = '#f12436';
        ctx.beginPath();
        ctx.arc(cell.x + gridSize / 2, cell.y + gridSize / 2, gridSize / 4, 0, 2 * Math.PI);
        ctx.fill();

        // Generate random number only if it hasn't been generated before
        if (appleNumbers[index] === undefined) {
            appleNumbers[index] = Math.floor(Math.random() * 9) + 1;
        }

        // Use the stored/generated number
        const number = appleNumbers[index];

        // Draw the number on the apple
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number, cell.x + gridSize / 2, cell.y + gridSize / 2);
    });
}
placeApples();


let isDrawing = false;
let startX, startY;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    canvasImage = ctx.getImageData(0, 0, canvas.width, canvas.height); // Save the current state of the canvas
});



canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        ctx.putImageData(canvasImage, 0, 0);
        const rectWidth = e.offsetX - startX;
        const rectHeight = e.offsetY - startY;
        ctx.beginPath();
        ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
        ctx.stroke();
        highlightApples(startX, startY, rectWidth, rectHeight);
    }
});

function mouseLeave(e) {
    isDrawing = false;

    ctx.putImageData(canvasImage,0,0)
    const rectWidth = Math.abs(e.offsetX - startX);
    const rectHeight = Math.abs(e.offsetY - startY);
    const rectX = Math.min(e.offsetX, startX);
    const rectY = Math.min(e.offsetY, startY);j

    if (sumOfHighlightedApples === 10) {
        console.log('working');
        removeApples(rectX, rectY, rectWidth, rectHeight);
        //placeApples(); // Redraw apples after removal
        ctx.putImageData(canvasImage,0,0);
    }
}



let sumOfHighlightedApples = 0;

function highlightApples(rectX, rectY, rectWidth, rectHeight) {

    sumOfHighlightedApples = 0;

    grid.forEach((cell, index) => {
        const appleX = cell.x + gridSize / 2;
        const appleY = cell.y + gridSize / 2;

        if (isAppleInsideRectangle(appleX, appleY, rectX, rectY, rectWidth, rectHeight)) {
            sumOfHighlightedApples += appleNumbers[index];
            
            // Highlight the apple, for example, by drawing a larger circle or changing its color
            ctx.fillStyle = 'yellow'; // Change color for highlighting
            ctx.beginPath();
            ctx.arc(appleX, appleY, gridSize / 3, 0, 2 * Math.PI); // Draw a larger circle for highlight
            ctx.fill();

            const number = appleNumbers[index];
            // Draw the number on the apple
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(number, cell.x + gridSize / 2, cell.y + gridSize / 2);
 
        }
    });

    updateSumDisplay(sumOfHighlightedApples);
}

function removeApples(rectX, rectY, rectWidth, rectHeight) {
    placeApples();
    for (let i = grid.length - 1; i >= 0; i--) {
        const cell = grid[i];
        const appleX = cell.x + gridSize / 2;
        const appleY = cell.y + gridSize / 2;

        if (isAppleInsideRectangle(appleX, appleY, rectX, rectY, rectWidth, rectHeight)) {

            ctx.fillStyle = '#d9f6cd';
            ctx.beginPath();
            ctx.arc(appleX, appleY, gridSize / 2, 0, 2 * Math.PI);
            ctx.fill();
            //canvasImage = ctx.getImageData(0, 0, canvas.width, canvas.height); // Save the current state of the canvas

            grid.splice(i, 1); // Remove the cell from the grid
            appleNumbers.splice(i, 1); // Remove the corresponding number
        }
    }
    //placeApples();
}

function updateSumDisplay(sum) {
    const sumDisplay = document.getElementById('sumDisplay');
    sumDisplay.textContent = "Sum of Highlighted Apples: " + sum;
}

function isAppleInsideRectangle(appleX, appleY, rectX, rectY, rectWidth, rectHeight) {
    return appleX >= rectX && appleX <= rectX + rectWidth &&
           appleY >= rectY && appleY <= rectY + rectHeight;
}

canvas.addEventListener('mouseup', function(e) { mouseLeave(e); });
canvas.addEventListener('mouseleave', function(e) { mouseLeave(e); });



