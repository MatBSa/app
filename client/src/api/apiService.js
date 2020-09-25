import http from './http-common';

const getAll = (period) => {
  return http.get(`/transaction?period=${period}`);
};

const post = (data) => {
  return http.post('/transaction/', data);
};

const update = (id, data) => {
  return http.put(`/transaction/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/transaction/${id}`);
};

export default {
  getAll,
  post,
  update,
  remove,
};