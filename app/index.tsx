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
import styles from './styles';

// Tipo de tarea
type Task = {
  userId?: number;
  id: string;
  title: string;
  completed: boolean;
};

const API_URL = 'http://localhost:5000/tasks';

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
      setTasks(data.reverse());
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

    const newTask: Omit<Task, 'id'> = {
      title: taskText,
      completed: false,
    };

    try {
      const response = await axios.post(API_URL, newTask, {
        headers: {
          'Content-Type': 'application/json',
        },
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
      setError('Error al actualizar la tarea.');
    }
  };

  // Eliminar tarea
  const deleteTask = async (taskId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${taskId}`);

      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
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

      {/* Mostrar modal para agregar tarea */}
      <Button title="Agregar Tarea" onPress={() => setModalVisible(true)} />

      {/* Modal para crear una nueva tarea */}
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

      {/* Mostrar errores */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Cargar tareas */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
};

export default TodoApp;
