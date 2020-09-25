import React, { useState, useEffect } from 'react';

const INSERTING = 0;
const EDITING = 1;

function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const today = `${year}-${month}-${day}`;
  return today;
};

export default function MaintenanceScreen({ transaction, onCancel, onSave }) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(today());
  const [type, setType] = useState('-');
  const [node, setMode] = useState(INSERTING);

  useEffect(() => {
    if (!transaction) {
      return;
    }
    const { description, value, category, yearMonthDay, type } = transaction;

    setDescription(description);
    setValue(value);
    setDate(yearMonthDay);
    setCategory(category);
    setType(type);
    setMode(EDITING);
  }, [transaction]);

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value.trim();
    setDescription(newDescription);
  };

  const handleValueChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value.trim();
    setCategory(newCategory);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value.trim();
    setDate(newDate);
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setType(newType);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const handleSaveClick = () => {
    const newTransaction = {
      _id: !!transaction ? transaction._id : null,
      description,
      value,
      type,
      yearMonthDay: date,
      category,
    };
    onSave(newTransaction);
  };

  return (
    <div>

      <div style={{ marginBottom: '20px' }}>

        <span style={{ marginLeft: '30px', backgroudColor: '#c0392b' }}>
          <label>
            <input
              type="radio"
              name='expense_earning'
              checked={type === '-'}
              onChange={handleTypeChange}
              value="-"
            />
            <span>Despesas</span>
          </label>
        </span>

        <span style={{ marginLeft: '30px', backgroudColor: '#27ae60' }}>
          <label>
            <input
              type="radio"
              name='expense_earning'
              checked="+"
              onChange={handleTypeChange}
              value={type}
            />
            <span>Receita</span>
          </label>
        </span>

      </div>


      <div className="input-field">
        <input
          id='inputDescription'
          value={description}
          onChange={handleDescriptionChange}
          type="text"
        />
        <label htmlFor="inputDescription" className='active'>Descrição:</label>
      </div>

      <div className="input-field">
        <input
          id='inputValue'
          value={value}
          onChange={handleValueChange}
          type="number"
        />
        <label htmlFor="inputValue" className='active'>Valor:</label>
      </div>

      <div className="input-field">
        <input
          id='inputCategory'
          value={category}
          onChange={handleCategoryChange}
          type="text"
        />
        <label htmlFor="inputCategory" className='active'>Categoria:</label>
      </div>

      <div className="input-field">
        <input
          id='inputDate'
          value={date}
          onChange={handleDateChange}
          type="date"
        />
        <label htmlFor="inputDate" className='active'>Data:</label>
      </div>

      <button
        className='waves-effect waves-light btn'
        onClick={handleSaveClick}
      >
        Salvar
        </button>

      <button
        className='waves-effect waves-light btn red darken-4'
        style={{ marginLeft: '10px' }}
        onClick={handleCancelClick}
      >
        Cancelar
      </button>

    </div >
  )
}
