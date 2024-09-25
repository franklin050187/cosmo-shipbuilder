//This is for detecting key inputs and handling them

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "z") {
        undo()
    }
});
