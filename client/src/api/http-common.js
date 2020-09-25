import axios from 'axios';

//Define a URL base da origem para consumo do servico
export default axios.create({
  baseURL: 'https://cont-financas.herokuapp.com/api',
  headers: {
    'Content-type': 'application/json',
  },
});
