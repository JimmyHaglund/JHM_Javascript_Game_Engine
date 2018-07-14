<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
            canvas 
            {
                background-color: #f1f1f1;
                align-self: center;
                position:absolute;
                border:3px solid black;
            }
            div.preload
            {
                display : none;
            }
            body
            {
                background-color: rgb(49, 49, 49);
            }
        </style>
    </head>

    <body onload="Start()" 
        onmousedown = "AcceptMousePress(event)" 
        onmouseup="AcceptMouseRelease(event)" 
        onmousemove = "MouseMove(event)" 
        onkeydown = "AcceptKeyPress(event)" 
        onkeyup = "AcceptKeyUp(event)">
        
        <div class = "preload" id = "preload">
        <?php
        include './dir.php';
        DrawImages("./Sprites/", "png");
        LoadScripts("./Scripts/JHM-Framework/");
        ?>
        </div>

        <script src = "./Scripts/Master.js"></script>
        
    </body>
</html>