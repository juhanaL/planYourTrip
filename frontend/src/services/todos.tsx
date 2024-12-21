import axios from 'axios';

interface TodosType {
  text: string;
  placeNumber: number;
  done: boolean;
}

const baseUrl = '/api/todos';

let token: string = '';

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getAllTodos = () => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.get(baseUrl, config);
  return request.then((response) => response.data);
};

const createNewTodo = (newObject: TodosType) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.post(baseUrl, newObject, config);
  return request.then((response) => response.data);
};

const updatePlaceNumber = (id: number, newPlaceNumber: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.put(`${baseUrl}/${id}`, { placeNumber: newPlaceNumber }, config);
  return request.then((response) => response.data);
};

const updateText = (id: number, newText: string) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.put(`${baseUrl}/${id}`, { text: newText }, config);
  return request.then((response) => response.data);
};

const updateDoneStatus = (id: number, newStatus: boolean) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.put(`${baseUrl}/${id}`, { done: newStatus }, config);
  return request.then((response) => response.data);
};

const updateAll = (id: number, updatedObject: TodosType) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.put(
    `${baseUrl}/${id}`,
    {
      text: updatedObject.text,
      placeNumber: updatedObject.placeNumber,
      done: updatedObject.done,
    },
    config
  );
  return request.then((response) => response.data);
};

const deleteTodo = (id: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.delete(`${baseUrl}/${id}`, config);
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
  setToken,
};
