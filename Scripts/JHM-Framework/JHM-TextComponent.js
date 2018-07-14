/**
 * Adds a text to an entity.
 */

 function TextComponent(text)
 {
    // Text string array.
    var text = text;

    // Text offset
    var offsetX = 0;
    var offsetY = 0;

    // Text color
    var color = "#000000";

    // Text font size
    var font = "20px Georgia";

    var lineHeight = 20;
    var lineWidth = 100;

    let textcomponent = function()
    {
        this.Start = function()
        {
            // Add this component to list of entities to render.
            this.GetEntity().GetWindow().AddRenderComponent(this);
            this.SetFont("Times New Roman", 16)
        }

        this.SetOffset = function(xOffset, yOffset)
        {
            offsetX = CheckTypeForNumber(xOffset);
            offsetY = CheckTypeForNumber(yOffset);
        }

        this.Render = function()
        {
            var context = this.GetEntity().GetWindow().GetContext();
            context.fillStyle = color;
            context.font = font;
            var posX = this.GetEntity().Coordinates().x + offsetX;
            var posY = this.GetEntity().Coordinates().y + offsetY;
            // TODO: Make check for if filltext is an array.
            // TODO: Allow vertical or horizontal alignment.
            // TODO: Resizing text box & auto fill & resize.
            for (var n = 0; n < text.length; ++n)
            {
                context.fillText(text[n], posX, posY + n*lineHeight);
            }
            // context.fillText(text, posX, posY);
        }

        this.SetText = function(targetText)
        {
            var iterations = 0;
            var targetLength = targetText.length;
            while (text.length < targetLength && ++iterations < 100)
                text.push("???");
            iterations = 0;
            while (text.length > targetLength && ++iterations < 100)
                text.pop();
            // TODO: Improve to accept single string & auto - wrap text.
            for (var n = 0; n < text.length; ++n)
            {
                text[n] = targetText[n];
            }
        }
        this.SetFont = function(fontName, fontSize)
        {
            font = "" + fontSize + "px " + fontName;
            lineHeight = fontSize;
        }
    }
    textcomponent.prototype = new Component();
    
    var returnComponent = new textcomponent();
    returnComponent.SetType("TextComponent");
    return returnComponent;
     

 }