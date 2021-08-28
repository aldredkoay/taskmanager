const express = require('express');
const session = require('express-session'); 
const path = require('path');
// const cors = require("cors");
// const morgan = require("morgan");
// const low = require("lowdb");
// const swaggerUI = require("swagger-ui-express")
// const swaggerJsDoc = require("swagger-jsdoc")
// const taskRouter = require("./routes/task")
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const fs = require('fs');



const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.db = db;
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

let raw_task = fs.readFileSync(path.resolve(__dirname, 'db.json'));
const tasklist = JSON.parse(raw_task);
// console.log(tasklist);
app.get('/', (req, res)=> {
	return res.render('login');
});

app.post('/auth', (req, res) => {
	console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;

	session.loggedin = true;
	session.username = username;
	// session = req.session;
	res.redirect('/task');
});

app.get('/task', (req,res) => {
	console.log(session.username);
	if (!session.username) {
		return res.redirect('/');
	}


	// let obj_task = ;
	let data = [];
	for (const val in tasklist.task){
		if (tasklist.task[val]['removed'] == false){
			data.push(tasklist.task[val]);
		}
	}

	return res.render('task', {
		title: 'Task List',
		tasklist : data,
		username : session.username
	})
})

app.post('/task', (req, res) => {
	let taskname = req.body.taskname;
	// let tasklist = JSON.parse(tasklist);
	// console.log(tasklist.length);
	length = tasklist.task.length;
	// console.log();
	tasklist.task.push({
		id : length+1,
		taskname: taskname,
		status: 'Doing',
		removed: false
	})

	// obj.table.push({id: 1, square:2});
	// Convert it from an object to a string with JSON.stringify

	var json = JSON.stringify(tasklist);
	// Use fs to write the file to disk

	// var fs = require('fs');
	fs.writeFile('db.json', json, 'utf8', (err) => {
    if (err) throw err;
    	return res.redirect('/task')
    });
});

app.post('/task/edit', (req, res) =>{
	id = req.body.id;
	edit_list = [];
	for (const val in tasklist.task){		
		if (tasklist.task[val]['id'] == id) {
			// console.log('match')
			let data = tasklist.task[val];
			edit_list.push(data);
		}
	}
	// console.log(tasklist.task);
	return res.render('edit', {
		title: 'Edit List',
		editlist : edit_list
	});
});

app.post('/task/update', (req, res) =>{
	id = req.body.id;
	taskname = req.body.taskname;
	edit_list = [];
	for (const val in tasklist.task){
		console.log(tasklist.task[val], tasklist.task[val]['id'] == id);
		if (tasklist.task[val]['id'] == id) {
			tasklist.task[val]['taskname'] = taskname;
			// console.log(tasklist.task[val]);
		}		
	}
	console.log(tasklist.task);
	let json = JSON.stringify(tasklist);

	// console.log(json);
	// console.log(tasklist);
	fs.writeFile('db.json', json, 'utf8', (err) => {
    if (err) throw err;    	
	return res.redirect('/task');
    });
});

app.post('/task/delete', (req, res) => {
	id = req.body.id;
	for (const val in tasklist.task){		
		if (tasklist.task[val]['id'] == id) {
			// console.log('match')
			tasklist.task[val]['removed'] = true;
			// console.log(tasklist.task);
			let json = JSON.stringify(tasklist);
			fs.writeFile('db.json', json, 'utf8', (err) => {
		    if (err) throw err;
		    	return res.redirect('/task')
		    });
		}
		
	}
	
});

app.post('/logout', (req, res)=> {
	session.loggedin = true;
	session.username = '';
	return res.redirect('/');
});

app.listen(PORT, () => {
	console.log("Serve is listening on port 3000");
});





// // var mysql = require('mysql');
// const express = require('express');
// var session = require('express-session');
// var bodyParser = require('body-parser');
// 
// // var loginRouter = require('./route/login');
// // var connection = mysql.createConnection({
// // 	host     : 'localhost',
// // 	user     : 'root',
// // 	password : '',
// // 	database : 'nodelogin'
// // });
// var tasklist = [];
// var app = express();
// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }));
// app.use(bodyParser.urlencoded({extended : true}));
// app.use(bodyParser.json());
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/html/'));
// app.get('/login', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/html/login.html'));
// });


// app.post('/auth', function(request, response) {
// 	var username = request.body.username;
// 	var password = request.body.password;

// 	request.session.loggedin = true;
// 	request.session.username = username;
// 	response.redirect('/task');
// });

// app.get('/task', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/html/task.html'));
// 	response.render('task', {task : tasklist});
// 	// console.log(tasklist);
// 	// if (request.session.loggedin) {
// 	// 	response.send('Welcome back, ' + request.session.username + '!');
// 	// } else {
// 	// 	response.send('Please login to view this page!');
// 	// }
// 	// response.end();
// });

// app.post('/addtask', function(request, response) {
// 	var taskname = request.body.taskname;
// 	tasklist.push(taskname);
// 	response.redirect('/task');
// });

// app.listen(3000);