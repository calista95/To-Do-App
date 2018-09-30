function deletetask(id){
    $.ajax({
        url: '/task/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

