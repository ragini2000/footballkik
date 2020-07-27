const dependable = require('dependable');
const path=require('path');
const container=dependable.container();

const simpleDependencies=[
    ['_','lodash'],//Lodash is a JavaScript library which provides utility functions for common programming tasks using the functional programming paradigm
    ['mongoose','mongoose'],
    ['passport','passport'],
    ['formidable','formidable'],
    ['async', 'async'], 
    ['Users','./model/user'],
    ['Club', './model/clubs']//boday-parser doesnt allow us to pass data like images and files hence a third party module like formidable is used

]
simpleDependencies.forEach(function(val){
    container.register(val[0],function(){//.register method is a part of dependable module to register module
        return require(val[1]);
    })
});

container.load(path.join(__dirname,"/controllers"));//multiple .js files in the folder controller can have functions that can be used outside this files by calling module.exports
container.load(path.join(__dirname,"/helpers"));

container.register("container",function(){//register the container itself
    return container;
});
module.exports=container;