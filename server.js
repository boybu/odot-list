const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


app.use(cors());


app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'todo_list' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ message: 'Error fetching tasks' });
        }
        res.json(result);
    });
});

app.post('/tasks', async (req, res) => {
    const { task } = req.body;


    if (!task || task.trim() === '') {
        return res.status(400).json({ message: 'Task cannot be empty' });
    }


    db.query('INSERT INTO tasks (task) VALUES (?)', [task], (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            return res.status(500).json({ message: 'Error inserting task' });
        }

        res.status(201).json({ id: result.insertId, task });
    });
});



app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;


    if (!task || task.trim() === '') {
        return res.status(400).json({ message: 'Task cannot be empty' });
    }


    db.query('UPDATE tasks SET task = ? WHERE id = ?', [task, id], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ message: 'Error updating task' });
        }


        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }


        res.json({ id, task });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ message: 'Error deleting task' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
