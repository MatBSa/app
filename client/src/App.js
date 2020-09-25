import React, { useEffect, useState } from 'react';
import api from './api/apiService.js';
import ListScreen from './componentes/ListScreen.js';
import MaintenanceScreen from './componentes/MaintenanceScreen.js';

const PERIODS = [
  '2019-01',
  '2019-02',
  '2019-03',
  '2019-04',
  '2019-05',
  '2019-06',
  '2019-07',
  '2019-08',
  '2019-09',
  '2019-10',
  '2019-11',
  '2019-12',
  '2020-01',
  '2020-02',
  '2020-03',
  '2020-04',
  '2020-05',
  '2020-06',
  '2020-07',
  '2020-08',
  '2020-09',
  '2020-10',
  '2020-11',
  '2020-12',
  '2021-01',
  '2021-02',
  '2021-03',
  '2021-04',
  '2021-05',
  '2021-06',
  '2021-07',
  '2021-08',
  '2021-09',
  '2021-10',
  '2021-11',
  '2021-12',
];

const LIST_SCREEN = 0;
const MAINTENANCE_SCREEN = 1;
const EARNING_COLOR = '##27ae60';
const EXPENSE_COLOR = '#c0392b';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPeriod, serCurrentPeriod] = useState(PERIODS[0]);
  const [currentScreen, setCurrentScreen] = useState(LIST_SCREEN);
  const [filteredText, setFilteredText] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await api.getAll(currentPeriod);
      setTransactions(data.transactions);
    };
    fetchTransactions();
  }, [currentPeriod]);

  useEffect(() => {
    let newFilteredTransactions = [...transactions];
    if (filteredText.trim() !== '') {
      newFilteredTransactions = newFilteredTransactions.filter(transaction => {
        return transaction.description.toLowerCase().includes(filteredText);
      });
    }
    setFilteredTransactions(newFilteredTransactions);
  }, [transactions, filteredText]);

  useEffect(() => {
    const newScreen = (selectedTransaction !== null || newTransaction) ? MAINTENANCE_SCREEN : LIST_SCREEN;

    setCurrentScreen(newScreen);
  }, [selectedTransaction, newTransaction])

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value;
    serCurrentPeriod(newPeriod);
  };

  const handleDeleteTransaction = async (event) => {
    const id = event.target.id;
    await api.remove(id);

    const newTransactions = transactions.filter((transaction) => {
      return transaction._id !== id;
    });
    setTransactions(newTransactions);
  };

  const handleEditTransaction = async (event) => {
    const id = event.target.id;

    const newSelectedTransaction = filteredTransactions.find(transaction => {
      return transaction._id;
    })

    setSelectedTransaction(newSelectedTransaction);
  };

  const handleNewTransaction = async () => {
    setNewTransaction(true);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value.trim();
    setFilteredText(text.toLowerCase());
  };

  const handleCancelMaintenance = () => {
    setNewTransaction(false);
    setSelectedTransaction(null);
  };

  const handleSaveMaintenance = async (newTransaction) => {
    const { _id } = newTransaction;

    if (!_id) {

      const insertedTransaction = {
        ...newTransaction,
        year: Number(newTransaction.yearMonthDay.substring(0, 4)),
        month: Number(newTransaction.yearMonthDay.substring(5, 7)),
        day: Number(newTransaction.yearMonthDay.substring(8, 10)),
      }
      const { data } = await api.post(insertedTransaction);

      const newTransactions = [...transactions, data.transaction];
      newTransactions.sort((a, b) => a.yearMonthDay.localeCompare(b.yearMonthDay));

      setTransactions(newTransactions);
      setNewTransaction(false);

    } else {

      const editedTransaction = {
        ...newTransaction,
        year: Number(newTransaction.yearMonthDay.substring(0, 4)),
        month: Number(newTransaction.yearMonthDay.substring(5, 7)),
        day: Number(newTransaction.yearMonthDay.substring(8, 10)),
      }
      await api.update(_id, editedTransaction);

      const newTransactions = [...transactions];
      const index = newTransactions.findIndex((transaction) => {
        return transaction._id === editedTransaction._id;
      });

      newTransactions[index] = editedTransaction;

      setTransactions(newTransactions);
      setSelectedTransaction(null);
    }
  };

  return (<div className='container'>
    <h1 className='center' >Desafio Final do Bootcamp Full Stack</h1>;

    {
      currentScreen === LIST_SCREEN ? (
        <ListScreen
          transactions={filteredTransactions}
          periods={PERIODS}
          currentPeriod={currentPeriod}
          filteredText={filteredText}
          onEditTransaction={handleEditTransaction}
          onFilterChange={handleFilterChange}
          onPeriodChange={handlePeriodChange}
          onDeleteTransaction={handleDeleteTransaction}
          onNewTransaction={handleNewTransaction}
        />
      ) : (
          <MaintenanceScreen
            transaction={selectedTransaction}
            onCancel={handleCancelMaintenance}
            onSave={handleSaveMaintenance}
          />
        )

    }

  </div >
  );
}
