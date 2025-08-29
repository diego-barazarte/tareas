import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ListRenderItem,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons'; // Importando los íconos
import styles from './styles';

// URL de la API
const API_URL = 'http://localhost:5000/tasks';

// Tipo de tarea
type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Obtener tareas del API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const data: Task[] = response.data;
      setTasks(data.reverse()); // Últimas tareas primero
    } catch (error) {
      setError('Error al cargar las tareas.');
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva tarea
  const createTask = async () => {
    if (taskText.trim().length < 3) {
      alert('El título debe tener al menos 3 caracteres.');
      return;
    }

    const newTask: Omit<Task, '_id'> = {
      title: taskText,
      completed: false,
    };

    try {
      const response = await axios.post(API_URL, newTask, {
        headers: { 'Content-Type': 'application/json' },
      });

      const createdTask: Task = response.data;
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setTaskText('');
      setModalVisible(false);
    } catch (error) {
      setError('Error al crear la tarea.');
    }
  };

  // Marcar tarea como completada
  const toggleTaskCompletion = async (taskId: string) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);
    if (!taskToUpdate) return;

    const updatedTask: Task = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
    };

    try {
      const response = await axios.put(`${API_URL}/${taskId}`, updatedTask, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
        );
      }
    } catch (error) {
      setError('Error al actualizar la tarea.');
    }
  };

  // Eliminar tarea
  const deleteTask = async (taskId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${taskId}`);

      if (response.status === 204) {
        onRefresh();
      }
    } catch (error) {
      setError('Error al eliminar la tarea.');
    }
  };

  // Recargar tareas
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item._id)}>
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item._id)}>
        <MaterialIcons name="delete" size={24} color="#E74C3C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <Button title="Agregar Tarea" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nueva tarea"
            value={taskText}
            onChangeText={setTaskText}
          />
          <Button title="Guardar" onPress={createTask} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" style={styles.activityIndicator} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
};

export default TodoApp;
