const UiManager = function(){
    this.mouseX = 0;
    this.mouseY = 0;
    this.uiElements = [];

    this.clear = function(){
        this.uiElements.forEach((element) => {
            element.collider.destroy();
            // console.log(element.sprite);
            element.sprite.destroy();
            // console.log(element.entity.transform.x);
        });
        this.uiElements = [];
    }

    document.addEventListener("mousemove", (event) =>{
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.uiElements.forEach(element => {
            if (element.collider.overlapsPoint(this.mouseX, this.mouseY)){
                element.hover();
                // console.log("opverlap");
            } else {
                element.stopHover();
            }
        });
    })
    document.addEventListener("mousedown", () => {
        this.uiElements.forEach(element => {
            if (element.collider.overlapsPoint(this.mouseX, this.mouseY)){
                element.press();
                // console.log("opverlap");
            }
        });
    });
    document.addEventListener("mouseup", () =>{
        this.uiElements.forEach(element => {
            element.release(this.mouseX, this.mouseY);
        });
    });

}