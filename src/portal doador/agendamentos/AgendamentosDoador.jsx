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
  const [points, setPoints] = useState([]);

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
        setPoints(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar pontos de coleta:', error);
      });
  }, []);

  const getPointDetails = (pointId) => {
    return points.find(p => p.id === pointId) || {};
  };

  const handleButton = (agendamentoId, status) => {
    if (userToUse) {
      const updatedStatus = status;
      axios.put(`http://localhost:8000/api/v1/donation/${agendamentoId}/`, { 
        status: updatedStatus,
        doador_id: userToUse.id,
        ponto_coleta_id: getPointDetails(agendamentoId).id
      }, config)
      .then(response => {
        console.log('Status do agendamento atualizado:', response.data.status);
        setAgendamentoUser(prevAgendamentos =>
          prevAgendamentos.map(agendamento =>
            agendamento.id === agendamentoId ? { ...agendamento, status: updatedStatus } : agendamento
          )
        );
      })
      .catch(error => {
        console.error('Erro ao atualizar status do agendamento:', error);
      });
    } else {
      console.warn('Usuário ou ponto de coleta não definidos para atualização.');
    }
  };

  const HeaderAgendamento = () => {
    const handleNavigateHome = () => {
      if (userToUse?.is_doador) {
        navigate(`/doador/${userId}`, { state: { userId: userToUse.id, name: userToUse.name } });
      } else if (userToUse?.is_beneficiario) {
        navigate(`/beneficiario/${userId}`, { state: { userId: userToUse.id, name: userToUse.name } });
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
        <h1>Lista de agendamentos</h1>
      </header>
    );
  };

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
              {userToUse?.is_doador && (
                <div className={styles.agendamentoTitle}>
                  Agendamento de doação para o dia {agendamento.data_hora_agendada}, nossos fornecedores seguirão com o trabalho de busca!
                </div>
              )}
              {userToUse?.is_beneficiario && (
                <div className={styles.agendamentoTitle}>
                  Agendamento de pedido para o dia {agendamento.data_hora_agendada}, nossos fornecedores seguirão com o trabalho de entrega!
                </div>
              )}
              
              {getPointDetails(agendamento.ponto_coleta_id) && (
                <div className={styles.endereco}>
                  Endereço: {getPointDetails(agendamento.ponto_coleta_id).endereco}, {getPointDetails(agendamento.ponto_coleta_id).cidade}, {getPointDetails(agendamento.ponto_coleta_id).estado} - {getPointDetails(agendamento.ponto_coleta_id).cep}
                </div>
              )}
              <div className={styles.mudancaStatus}>
                <div className={`${styles.agendamentoStatus} ${agendamento.status === 'agendado' ? styles.agendado : ''} 
                              ${agendamento.status === 'concluido' ? styles.concluido : ''} 
                              ${agendamento.status === 'cancelado' ? styles.cancelado : ''}`} id='status'>
                  {agendamento.status}
                </div>
                {(agendamento.status !== 'concluido' && agendamento.status !== 'cancelado') && (
                  <div className={styles.botoes}>
                    <div className={styles.cancelar} onClick={() => handleButton(agendamento.id, 'cancelado')}><div>Cancelar</div></div>
                    <div className={styles.concluir} onClick={() => handleButton(agendamento.id, 'concluido')}><div>Concluir</div></div>
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
