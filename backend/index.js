const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/to-doApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.log('Error de conexión a MongoDB: ', err));

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Rutas

// Obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Error al obtener las tareas');
  }
});

// Crear una nueva tarea
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim().length < 3) {
    return res.status(400).send('El título es obligatorio y debe tener al menos 3 caracteres.');
  }

  try {
    const newTask = new Task({ title });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).send('Error al crear la tarea');
  }
});

// Marcar una tarea como completada
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send('Tarea no encontrada');
    }
    
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Error al actualizar la tarea');
  }
});

// Eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Task.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send('Tarea no encontrada');
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Error al eliminar la tarea');
  }
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
