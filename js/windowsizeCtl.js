window.onresize = function(e) {
    CANVAS_WIDTH = window.innerWidth;
    CANVAS_HEIGHT = window.innerHeight;

    document.querySelector("canvas").width = window.innerWidth;
}