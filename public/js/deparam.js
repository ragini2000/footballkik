(function($){//another method of writing document to ready
    $.deparam= $.deparam || function(uri){
        if(uri===undefined){
            uri=window.location.pathname; //uri will store everything after first forward slash(including) in path name
            //example URI: localhost:3000/chat/manny.manuel
            //window.location.pathname returns /chat/manny.manuel
        }
        var value1= window.location.pathname;//value1=3000/chat/manny.manuel
        var value2= value1.split('/');//split at '/' value2 is an array containing=["", "chat", "manny.manuel"]
        var value3=value2.pop();//value3= manny.manuel
        return value3;
    }

})(jQuery);