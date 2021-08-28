const express = require("express")
const router = express.Router()
const { nanoid } = require("nanoid")

const idLength = 8;

router.get("/", (req, res) => {
	const task = req.app.db.get("task")

	res.send(task);
});

router.get("/:id", (req, res) => {
	const task = req.app.db.get("task").find({ id : req.params.id}).value()

	res.send(task)
});

router.post('/', (req, res) => {
	try {
		const task = {
			id: nanoid(idLength),
			...req.body
		}

		req.app.db.get("task").push(task).write()
	} catch (error) {
		return res.status(500).send(error)
	}
})

router.put("/:id", (req, res)=>{
	try{
		req.app.db.get("task").find({ id : req.params.id}).assign(req.body).write()
		res.send(req.app.db.get("task").find({id:req.params.id}))
	} catch (error) {
		return res.status(500).send(error)
	}
})

router.delete("/:id", (req, res)=>{
	try{
		req.app.db.get("task").remove({ id : req.params.id}).write()
		res.sendStatus(200)
	} catch (error) {
		return res.status(500).send(error)
	}
})

module.exports = router;
// // var mysql = require('mysql');
// var express = require('express');
// var session = require('express-session');
// var bodyParser = require('body-parser');
// var path = require('path');

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

// app.get('/login', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/login.html'));
// });

// app.post('/auth', function(request, response) {
// 	var username = request.body.username;
// 	var password = request.body.password;

// 	request.session.loggedin = true;
// 	request.session.username = username;
// 	response.redirect('/task');
// });

// app.get('/task', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/task.html'));

// 	console.log(tasklist);
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