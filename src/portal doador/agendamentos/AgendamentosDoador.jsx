import React, { useState, useEffect } from 'react';
import styles from './AgendamentoDoador.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Agendamentos = () => {
  const location = useLocation();
  const userId = location.state.userId;
  console.log(userId)
  const name = location.state.name;
  console.log(name)

  const [agendamentos, setAgendamentos] = useState([]);

  const HeaderAgendamento = () => {
    const navigate = useNavigate();

    const handleNavigateHome = () => {
      navigate(`/doador/${userId}`, { state: { userId: userId, name: name } });
    };

    return (
      <header className={styles.HeaderAgendamento}>
        <nav>
          <ul>
            <li><a onClick={handleNavigateHome}>Home</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </nav>
        <h1>Portal do Doador</h1>
      </header>
    );
  };

  const FooterAgendamento = () => {
    return (
      <footer className={styles.FooterAgendamento}>
        <p>&copy; 2024 Portal de doação - SOS RS</p>
      </footer>
    );
  };

  useEffect(() => {
    // Simulação de busca de agendamentos para o usuário
    // Aqui você deve implementar a lógica para buscar os agendamentos do usuário com ID userId
    // Exemplo:
    // axios.get(`http://localhost:8000/api/v1/agendamentos/${userId}`)
    //   .then(response => {
    //     setAgendamentos(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Erro ao buscar agendamentos:', error);
    //   });
    // Neste exemplo, estou usando um estado estático `agendamentos` para demonstração.
  }, [userId]);

  return (
    <div className={styles.container}>
      <HeaderAgendamento />
      <main className="agendamentos-container">
        <h2>Lista de Agendamentos</h2>
        {agendamentos.map(agendamento => (
          <div key={agendamento.id} className="agendamento">
            <div className="agendamento-title">{agendamento.title}</div>
            <div className="agendamento-status">{agendamento.status}</div>
          </div>
        ))}
      </main>
      <FooterAgendamento />
    </div>
  );
};

export default Agendamentos;
