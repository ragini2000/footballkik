//contains validations for the user
'use strict';
module.exports=function(){
    return{
        SignUpvalidation:(req,res,next)=>{
            req.checkBody("username","Username is required").notEmpty();// to check if the username field is not empty, else return second parameter
            req.checkBody("username","Username must not be less than 5").isLength({min:5});// to check the length
            req.checkBody("email","Email is required").notEmpty();
            req.checkBody("password","Password is required").notEmpty();
            req.checkBody("password","Password should be greater than 5").isLength({min:5});
            req.checkBody("email","Invalid Email").isEmail();// to check if email is valid

            req.getValidationResult()
            .then((result)=>{
                const errors=result.array();
                const messages=[];
                errors.forEach(error => {
                    messages.push(error.msg);// it contains error messages
                });

                req.flash("error",messages);
                res.redirect("/signup");//redirect user back to signup page in case of errors
            })
            .catch((err)=>{
                return next();
            })
        },
        LoginValidation:(req,res,next)=>{
            req.checkBody("email","Email is required").notEmpty();
            req.checkBody("password","Password is required").notEmpty();
            req.checkBody("password","Password should be greater than 5").isLength({min:5});
            req.checkBody("email","Invalid Email").isEmail();// to check if email is valid

            req.getValidationResult()
            .then((result)=>{
                const errors=result.array();
                const messages=[];
                errors.forEach(error => {
                    messages.push(error.msg);// it contains error messages
                });

                req.flash("error",messages);
                res.redirect("/");//redirect user back to signup page in case of errors
            })
            .catch((err)=>{
                return next();
            })
        }
    }
}