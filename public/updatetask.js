function updateTask(id){
    $.ajax({
        url: '/task/' + id,
        type: 'PUT',
        data: $('#update-task').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
