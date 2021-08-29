const express = require('express');
const session = require('express-session'); 
const path = require('path');
// const cors = require("cors");
// const morgan = require("morgan");
// const low = require("lowdb");
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const fs = require('fs');

const app = express();
const options = {
	definition: {
		openapi:"3.0.0",
		info: {
			title: "TaskManager API",
			version: "1.0.0",
			description: "A simple task manager project"
		},
		servers: [
			{
				url: "http://localhost:3000"
			}
		]
	},
	apis: ["./app.js"] 
}

const specs = swaggerJsDoc(options)

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

let raw_task = fs.readFileSync(path.resolve(__dirname, 'db.json'));
const tasklist = JSON.parse(raw_task);
// console.log(tasklist);
app.get('/', (req, res)=> {
	return res.render('login');
});

app.post('/auth', (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;

	session.loggedin = true;
	session.username = username;
	res.redirect('/task');
});

app.get('/task', (req,res) => {
	console.log(session.username);
	if (!session.username) {
		return res.redirect('/');
	}

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
	status = req.body.status;
	edit_list = [];
	for (const val in tasklist.task){
		console.log(tasklist.task[val], tasklist.task[val]['id'] == id);
		if (tasklist.task[val]['id'] == id) {
			tasklist.task[val]['taskname'] = taskname;
			tasklist.task[val]['status'] = status;
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

// Task Delete
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

// Logout
app.post('/logout', (req, res)=> {
	session.loggedin = true;
	session.username = '';
	return res.redirect('/');
});

app.listen(PORT, () => {
	console.log("Serve is listening on port 3000");
});