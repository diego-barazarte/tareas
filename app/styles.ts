import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F7FC', // Azul suave de fondo
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',  // Mayor peso para hacer el título más destacado
    color: '#2C3E50', // Gris oscuro para el título
  },
  input: {
    height: 45,
    borderColor: '#3498DB',  // Azul más fuerte
    borderWidth: 2,
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    transform: [{ scale: 1 }],
    transition: 'transform 0.2s ease',
  },
  taskText: {
    fontSize: 18,
    color: '#34495E',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#BDC3C7',
  },
  deleteText: {
    color: '#E74C3C', // Rojo para el delete
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
  },
  modalInput: {
    height: 45,
    borderColor: '#3498DB',
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 18,
  },
  modalButton: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  activityIndicator: {
    marginTop: 50,
  },
});

export default styles;
