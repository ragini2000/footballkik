$(document).ready(function(){
    
    $('#favorite').on('submit', function(e){//submit event
        e.preventDefault();//to prvent the reload of page
        
        var id = $('#id').val();
        var clubName = $('#club_Name').val();

        $.ajax({
            url: '/home',// on the home page
            type: 'POST',//to post the data in the DB
            data: {
                id: id,
                clubName: clubName
            },
            success: function(){
                console.log(clubName);
            }
        })
        
    });
});