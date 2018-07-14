<?php
function DrawImages($dirname, $extension)
{
    $images = glob($dirname."*.".$extension);

    foreach($images as $image) 
    {
        echo '<img src="'.$image.'" id = "'.pathinfo($image)['filename'].'">
';
    }
}

function LoadScripts($dirName)
{
    $scripts = glob($dirName."*.js");
    
    foreach($scripts as $script)
    {
        echo '<script src = "'.$script.'"></script>
';
    }
}
?>