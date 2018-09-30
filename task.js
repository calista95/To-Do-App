module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTasks(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM task", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.tasks  = results;
            complete();
        });
    }

	function getTask(res, mysql, context, id, complete){
	        var sql = "SELECT * FROM task WHERE id = ?";
	        var inserts = [id];
	        mysql.pool.query(sql, inserts, function(error, results, fields){
			            if(error){
					                    res.write(JSON.stringify(error));
					                    res.end();
					                }
			            context.task = results[0];
			            complete();
			        });
	    }

	/*Display all tasks. Requires web based javascript to delete tasks with AJAX*/

    	router.get('/', function(req, res){
        	var callbackCount = 0;
        	var context = {};
        	context.jsscripts = ["deletetask.js"];
        	var mysql = req.app.get('mysql');
        	getTasks(res, mysql, context, complete);
        	function complete(){
            		callbackCount++;
            		if(callbackCount >= 1){
                		res.render('task', context);
            		}

        	}
    	});


	/* Display one task for the specific purpose of updating tasks */

	   router.get('/:id', function(req, res){
		            callbackCount = 0;
		            var context = {};
		            context.jsscripts = ["selectedtask.js", "updatetask.js"];
		            var mysql = req.app.get('mysql');
		            getTask(res, mysql, context, req.params.id, complete);
		            function complete(){
				                callbackCount++;
				                if(callbackCount >= 1){
							                res.render('update-task', context);
							            }

				            }
		        });

	 /* The URI that update data is sent to in order to update a task */

	    router.put('/:id', function(req, res){
		            var mysql = req.app.get('mysql');
		            console.log(req.body)
		            console.log(req.params.id)
		            var sql = "UPDATE task SET name=?, description=?, priority=?, difficulty=? WHERE id=?";
		            var inserts = [req.body.name, req.body.description, req.body.priority, req.body.difficulty, req.params.id];
		            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
				                if(error){
							                console.log(error)
							                res.write(JSON.stringify(error));
							                res.end();
							            }else{
									                    res.status(200);
									                    res.end();
									                }
				            });
		        });

	/* Adds a task, redirects to the page after adding */

	    router.post('/', function(req, res){
		            console.log(req.body)
		            var mysql = req.app.get('mysql');
		            var sql = "INSERT INTO task (name, description, priority, difficulty, done) VALUES (?,?,?,?,?)";
		            var inserts = [req.body.name, req.body.description, req.body.priority, req.body.difficulty, 0];
		            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
				                if(error){
							                console.log(JSON.stringify(error))
							                res.write(JSON.stringify(error));
							                res.end();
							            }else{
									                    res.redirect('/task/');
									                }
				            });
		        });
    
	 /* Route to delete a task, simply returns a 202 upon success. Ajax will handle this. */

	    router.delete('/:id', function(req, res){
		            var mysql = req.app.get('mysql');
		            var sql = "DELETE FROM task WHERE id = ?";
		            var inserts = [req.params.id];
		            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
				                if(error){
							                res.write(JSON.stringify(error));
							                res.status(400);
							                res.end();
							            }else{
									                    res.status(202).end();
									                }
				            })
		        })


	return router;
}();
