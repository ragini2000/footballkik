const dependable = require('dependable');
const path=require('path');
const container=dependable.container();

const simpleDependencies=[
    ['_','lodash'],
    ['mongoose','mongoose'],
    ['passport','passport'],
    ['formidable','formidable']//boday-parser doesnt allow us to pass data like images and files hence a third party module like formidable is used

]
simpleDependencies.forEach(function(val){
    container.register(val[0],function(){
        return require(val[1]);
    })
});

container.load(path.join(__dirname,"/controllers"));
container.load(path.join(__dirname,"/helpers"));

container.register("container",function(){
    return container;
});
module.exports=container;