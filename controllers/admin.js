var path=require("path");
var fs=require("fs");
module.exports=function(formidable,Club){
    return{
        SetRouting:function(router){
            router.get('/dashboard', this.adminPage);
            router.post('/uploadFile', this.uploadFile);//for images/file
            router.post('/dashboard', this.adminPostPage);//adding post route to save filename and properties into the database
        },
        adminPage: function(req, res){
            res.render('admin/dashboard');
        },
        adminPostPage: function(req, res){
            const newClub = new Club();//represent different chat groups
            newClub.name = req.body.club;s
            newClub.country = req.body.country;
            newClub.image = req.body.upload;
            newClub.save((err) => {
                res.render('admin/dashboard');
            })
        },
        uploadFile: function(req, res) {//add formidable events to add images to a local folder public/uploads in the project
            const form = new formidable.IncomingForm();//incomingForm method available in formidable module
            form.uploadDir=path.join(__dirname,"../public/uploads");//path where we want the file to be saved in
            form.on("file",function(field,file){//listen file event, on to listen event
                fs.rename(file.path,path.join(form.uploadDir,file.name),function(err){//to rename the file to save it with its original name
                        if(err){
                            throw err;
                        }
                        console.log("File renamed Successfully");//displayed in node.js console
                    })
                });
                form.on("error",function(err){//to listen for error events
                    console.log(err);
                });
                form.on("end",function(){//to check if file upload is successful
                    console.log("File upload is success full");//this will be shown in the node.js console
                });
                form.parse(req);
            }
    }
 }