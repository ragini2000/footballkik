const mongoose=require("mongoose");
var bcrypt=require("bcrypt-nodejs");

const userSchema=mongoose.Schema({
    fullname:{type:String,unique:true,default:""},
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    password:{type:String,unique:true,default:""},//we add default here since if user wants to login through fb or gmail, we dont need him to enter pasword
    UserImage:{type:String,default:"default.png"},//in database, we only store the name of the image and not the image itself, image is stored in AWS bucket
    facebook:{type:String,default:""},
    fbToken:Array

});

userSchema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);//bcrypt used to encrypt the password before saving into the database
}
userSchema.methods.validUserPassword=function(password){
    return bcrypt.compareSync(password,this.password);//To decrypt the password in the database and compare with the one user provided
}

module.exports=mongoose.model("User",userSchema);