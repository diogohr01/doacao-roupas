import React, { useState, useEffect } from 'react';
import styles from '../agendamentos/AgendamentoDoador.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Agendamentos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || null;
  const name = location.state?.name || null;
  const [users, setUsers] = useState([]);
  const [userToUse, setUserToUse] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoUser, setAgendamentoUser] = useState([]);
  const [point, setPoint] = useState([]);
  const [pointToUse, setPointToUse] = useState(null);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token cab1c9c2bd96e108f7c3695ea1af98f0abc9a1a9`
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/accounts/', config)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
      });
  }, []);

  useEffect(() => {
    if (users.length > 0 && name) {
      const foundUser = users.find(user => user.name === name);
      if (foundUser) {
        setUserToUse(foundUser);
      } else {
        console.warn(`Usuário com o nome '${name}' não encontrado.`);
      }
    }
  }, [users, name]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/donation/', config)
      .then(response => {
        setAgendamentos(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar doações:', error);
      });
  }, []);

  useEffect(() => {
    if (agendamentos.length > 0 && userToUse) {
      const foundAgendamentoUser = agendamentos.filter(agendamento => agendamento.doador_id === userToUse.id);
      setAgendamentoUser(foundAgendamentoUser);
    }
  }, [agendamentos, userToUse]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/point/', config)
      .then(response => {
        setPoint(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar pontos de coleta:', error);
      });
  }, []);

  useEffect(() => {
    if (point.length > 0 && agendamentoUser.length > 0) {
      const foundPoint = point.find(p => p.id === agendamentoUser[0].ponto_coleta_id);
      if (foundPoint) {
        setPointToUse(foundPoint);
      } else {
        console.warn(`Ponto de coleta com o ID '${agendamentoUser[0].ponto_coleta_id}' não encontrado.`);
      }
    }
  }, [point, agendamentoUser]);

  const HeaderAgendamento = () => {
    const handleNavigateHome = () => {
      if (userToUse) {
        navigate(`/doador/${userId}`, { state: { userId: userToUse.id, name: userToUse.name } });
      } else {
        console.warn('Usuário não encontrado para navegação.');
      }
    };

    return (
      <header className={styles.headerAgendamento}>
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
  const handleButton = (agendamentoId) => {
    if (handleButton) {
      const agendamento = agendamentoUser.find(agendamento => agendamento.id === agendamentoId);
      if (!agendamento) {
        console.warn(`Agendamento com ID '${agendamentoId}' não encontrado.`);
        return;
      }
      const updatedStatus = 'concluido';
      axios.put(`http://localhost:8000/api/v1/donation/${agendamentoId}/`, { status: updatedStatus }, config)
        .then(response => {
          console.log('Status do agendamento atualizado:', response.data.status);
          setAgendamentoUser(prevAgendamentos =>
            prevAgendamentos.map(agendamento =>
              agendamento.id === agendamentoId ? { ...agendamento, status: updatedStatus } : agendamento
            )
          );
        })

    }
  }

  const handleButtonCancel = (agendamentoId) => {
    if (handleButtonCancel) {
      const agendamento = agendamentoUser.find(agendamento => agendamento.id === agendamentoId);
      if (!agendamento) {
        console.warn(`Agendamento com ID '${agendamentoId}' não encontrado.`);
        return;
      }
      const updatedStatus = 'cancelado';
      axios.put(`http://localhost:8000/api/v1/donation/${agendamentoId}/`, { status: updatedStatus }, config)
        .then(response => {
          console.log('Status do agendamento atualizado:', response.data.status);
          setAgendamentoUser(prevAgendamentos =>
            prevAgendamentos.map(agendamento =>
              agendamento.id === agendamentoId ? { ...agendamento, status: updatedStatus } : agendamento
            )
          );
        })

    }
  }

  const FooterAgendamento = () => {
    return (
      <footer className={styles.footerAgendamento}>
        <p>&copy; 2024 Portal de doação - SOS RS</p>
      </footer>
    );
  };



  return (
    <div className={styles.container}>
      <HeaderAgendamento />
      <main className={styles.agendamentosContainer}>
        <h2>Lista de Agendamentos</h2>
        {agendamentoUser && agendamentoUser.length > 0 ? (
          agendamentoUser.map(agendamento => (
            <div key={agendamento.id} className={styles.agendamento}>
              <div className={styles.agendamentoTitle}>
                Agendamento de doação para o dia {agendamento.data_hora_agendada}, nossos fornecedores seguirão com o trabalho de busca!

              </div>
              {pointToUse && (
                <div className={styles.endereco}>Endereço: {pointToUse.endereco}, {pointToUse.cidade}, {pointToUse.estado} - {pointToUse.cep}</div>
              )}
              <div className={styles.mudancaStatus}>
                <div className={`${styles.agendamentoStatus} ${agendamento.status === 'agendado' ? styles.agendado : ''} 
                              ${agendamento.status === 'concluido' ? styles.concluido : ''} 
                              ${agendamento.status === 'cancelado' ? styles.cancelado : ''}`} id='status'>
                  {agendamento.status}
                  
                </div>
                {(agendamento.status !== 'concluido' && agendamento.status !== 'cancelado') && (
                  <div className={styles.botoes}>
                    <div className={styles.cancelar} onClick={() => handleButtonCancel(agendamento.id)}><div>Cancelar</div></div>
                    <div className={styles.concluir} onClick={() => handleButton(agendamento.id)}><div>Concluir</div></div>
                  </div>
                )}
              </div>
            </div>

          ))
        ) : (
          <p>Nenhum agendamento encontrado.</p>
        )}
      </main>
      <FooterAgendamento />
    </div>
  );
};

export default Agendamentos;
