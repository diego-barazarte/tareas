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
      const response = await fetch(API_URL);
      const data: Task[] = await response.json();
      setTasks(data.reverse()); // Últimas tareas primero
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      const createdTask: Task = await response.json();
      setTasks((prevTasks) => [createdTask, ...prevTasks]); // Agregar nueva tarea al principio
      setTaskText('');
    } catch (error) {
      console.error('Error creating task:', error);
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
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? updatedTask : task
          )
        );
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // 4. Eliminar tarea
  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
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
