import axios from 'axios';

interface TodosType {
  text: string;
  placeNumber: number;
  done: boolean;
}

const baseUrl = '/api/todos';

const getAllTodos = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createNewTodo = (newObject: TodosType) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const updatePlaceNumber = (id: number, newPlaceNumber: number) => {
  const request = axios.put(`${baseUrl}/${id}`, { placeNumber: newPlaceNumber });
  return request.then((response) => response.data);
};

const updateText = (id: number, newText: string) => {
  const request = axios.put(`${baseUrl}/${id}`, { text: newText });
  return request.then((response) => response.data);
};

const updateDoneStatus = (id: number, newStatus: boolean) => {
  const request = axios.put(`${baseUrl}/${id}`, { done: newStatus });
  return request.then((response) => response.data);
};

const updateAll = (id: number, updatedObject: TodosType) => {
  const request = axios.put(`${baseUrl}/${id}`, {
    text: updatedObject.text,
    placeNumber: updatedObject.placeNumber,
    done: updatedObject.done,
  });
  return request.then((response) => response.data);
};

const deleteTodo = (id: number) => {
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
