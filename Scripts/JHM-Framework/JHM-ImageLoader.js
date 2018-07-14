

var ImageLoader = function()
{
    var image = new Image();
    image.src = url;
    return image;


    var path = require('path');
    var fs = require('fs');
    var dirPath = './Sprites';  //directory path
    var fileType = '.png'; //file extension
    var files = [];
    fs.readdir(dirPath, function(err, list)
    {
        if(err) throw err;
        for(var i=0; i<list.length; i++)
        {
            if(path.extname(list[i])===fileType)
            {
                console.log(list[i]); //print the file
                files.push(list[i]); //store the file name into the array files
            }
        }
    });
}