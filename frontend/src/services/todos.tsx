import axios from 'axios';

interface TodosType {
  text: string;
  placeNumber: number;
  done: boolean;
}

const baseUrl = 'http://localhost:3001/api/todos';

const getAllTodos = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createNewTodo = (newObject: TodosType) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const updatePlaceNumber = (id: string, newPlaceNumber: number) => {
  const request = axios.put(`${baseUrl}/${id}`, { placeNumber: newPlaceNumber });
  return request.then((response) => response.data);
};

const updateText = (id: string, newText: string) => {
  const request = axios.put(`${baseUrl}/${id}`, { text: newText });
  return request.then((response) => response.data);
};

const updateDoneStatus = (id: string, newStatus: boolean) => {
  const request = axios.put(`${baseUrl}/${id}`, { done: newStatus });
  return request.then((response) => response.data);
};

const updateAll = (id: string, updatedObject: TodosType) => {
  const request = axios.put(`${baseUrl}/${id}`, {
    text: updatedObject.text,
    placeNumber: updatedObject.placeNumber,
    done: updatedObject.done,
  });
  return request.then((response) => response.data);
};

const deleteTodo = (id: string) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default {
  getAllTodos,
  createNewTodo,
  updatePlaceNumber,
  updateText,
  updateDoneStatus,
  updateAll,
  deleteTodo,
};
