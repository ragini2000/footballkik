$(document).ready(function(){
    $('.upload-btn').on('click', function(){
        $('#upload-input').click();
    });
    
    $('#upload-input').on('change', function(){//to check if there is any change
        var uploadInput = $('#upload-input');// to get data from the input field
        
        if(uploadInput.val() != ''){// when input field is not empty
            var formData = new FormData();
            
            formData.append('upload', uploadInput[0].files[0]);//automatically creates a key value pair
            
            $.ajax({//to send data from client to the server
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    uploadInput.val('');//when data sent successfully, data field will become empty
                }
            })
        }
    })
})