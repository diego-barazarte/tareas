import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  ListRenderItem,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

// Tipo de tarea
type Task = {
  userId?: number;
  id: number;
  title: string;
  completed: boolean;
};

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');

  // 1. Obtener tareas del API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      const data: Task[] = response.data;
      setTasks(data.reverse()); // Últimas tareas primero
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Si el error es un error de Axios
        console.error('Error fetching tasks:', error.response?.data || error.message);
      } else {
        // Si el error no es de Axios
        console.error('Unexpected error fetching tasks:', error);
      }
    }
  };

  // 2. Crear nueva tarea
  const createTask = async () => {
    if (taskText.trim() === '') return;

    const newTask: Omit<Task, 'id'> = {
      title: taskText,
      completed: false, // Nuevas tareas por defecto no están completas
    };

    try {
      const response = await axios.post(API_URL, newTask, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const createdTask: Task = response.data;
      setTasks((prevTasks) => [...prevTasks, createdTask]); // Agregar nueva tarea al final
      setTaskText('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating task:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error creating task:', error);
      }
    }
  };

  // 3. Marcar como completada
  const toggleTaskCompletion = async (taskId: number) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask: Task = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
    };

    try {
      const response = await axios.put(`${API_URL}/${taskId}`, updatedTask, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error toggling task:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error toggling task:', error);
      }
    }
  };

  // 4. Eliminar tarea
  const deleteTask = async (taskId: number) => {
    try {
      const response = await axios.delete(`${API_URL}/${taskId}`);

      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error deleting task:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error deleting task:', error);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva tarea"
        value={taskText}
        onChangeText={setTaskText}
      />
      <Button title="Agregar Tarea" onPress={createTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TodoApp;
