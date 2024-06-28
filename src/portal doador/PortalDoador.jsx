import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PortalDoador.module.css';
import { useLocation } from 'react-router-dom';
import { headers } from 'next/headers';

const Header = () => {
  const location = useLocation();
  const name = location.state.name;
  return (
    <header className={styles.header}>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Agendamentos</a></li>
          <li><a href="#">Contato</a></li>
        </ul>
      </nav>
      <h1>Portal do Doador</h1>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2024 Portal de doação - SOS RS</p>
    </footer>
  );
};

const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token 06d074d8acee898dc5e4e203efd89487f23bda8a`
  }
};

const PortalDoador = () => {
  const location = useLocation();
  const userId = location.state.userId;
  const name = location.state.name;
  const [users, setUsers] = useState([]);
  const [userToUse, setUserToUse] = useState(null);

  useEffect(() => {
    // Buscar todos os usuários na API
    axios.get(`http://localhost:8000/api/v1/accounts/`, config)
      .then(response => {
        setUsers(response.data); // Armazenar todos os usuários retornados pela API
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
      });
  }, []);

  useEffect(() => {
    // Verificar se temos o usuário a ser usado (exemplo: pelo nome)
    if (users.length > 0 && name) {
      const foundUser = users.find(user => user.name === name);
      if (foundUser) {
        setUserToUse(foundUser); // Armazenar o usuário encontrado
      } else {
        console.warn(`Usuário com o nome '${name}' não encontrado.`);
      }
    }
  }, [users, name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Lógica para lidar com o envio do formulário
  };

  return (
    <div className={styles.container}>
      <Header />
      <main>
        <h1>Bem-vindo, {name}!</h1>
        <section className={styles.doacao}>
          <h3>Faça uma doação de roupas</h3>
          <form onSubmit={handleSubmit}>
            <label>Selecione o tipo de roupa:</label>
            <select>
              {/* Opções do select */}
            </select>
            <label>Tamanho:</label>
            <select>
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
            </select>
            <label>Condição da roupa:</label>
            <select>
              <option value="novo">Novo</option>
              <option value="usado">Usado</option>
            </select>
            <label>Endereço para coleta:</label>
            <input type="text" placeholder="Rua, número, bairro" />
            <label>Cidade:</label>
            <input type="text" />
            <label>Estado:</label>
            <select>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              {/* ... */}
            </select>
            <label>Data do agendamento:</label>
            <input type="date" name="dataAgendada" />
            <label>CEP:</label>
            <input type="text" />
            <button type="submit">Doar</button>
          </form>
        </section>
        <section className={styles.pontosColeta}>
          <h3>Agendamentos: </h3>
          <ul>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PortalDoador;
