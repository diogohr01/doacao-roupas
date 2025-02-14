import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PortalDoador.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import Notification from './notificação';

const PortalDoador = () => {
  const location = useLocation();
  const userId = location.state?.userId || null;
  const name = location.state?.name || null;
  const [users, setUsers] = useState([]);
  const [userToUse, setUserToUse] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [optionsTipo, setOptionsTipo] = useState([]);
  const [optionsTamanho, setOptionsTamanho] = useState([]);
  const [optionsCondicao, setOptionsCondicao] = useState([]);
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [dataAgendada, setDataAgendada] = useState('');
  const [tipoRoupa, setTipoRoupa] = useState('');
  const [tamanhoRoupa, setTamanhoRoupa] = useState('');
  const [condicaoRoupa, setCondicaoRoupa] = useState('');
  const [quantidadeRoupa, setQuantidadeRoupa] = useState('');
  const [donation, setDonation] = useState([]);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();

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
      'Authorization': `Token c867237febd767a365d6ccea936b549944ef9548`
    }
  };

  const getUniqueValues = (array, key) => {
    return [...new Set(array.map(item => item[key]))];
  };

  const estados = [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
    "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
    "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
    "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
  ];

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
    axios.get('http://localhost:8000/api/v1/catalog/', config)
      .then(response => {
        setCatalog(response.data);

        const uniqueTipos = getUniqueValues(response.data, 'tipo');
        const uniqueTamanhos = getUniqueValues(response.data, 'tamanho');
        const uniqueCondicoes = getUniqueValues(response.data, 'condicao');

        const optionsTipo = uniqueTipos.map(value => ({
          value: value,
          label: value
        }));
        const optionsTamanho = uniqueTamanhos.map(value => ({
          value: value,
          label: value
        }));
        const optionsCondicao = uniqueCondicoes.map(value => ({
          value: value,
          label: value
        }));

        setOptionsTipo(optionsTipo);
        setOptionsTamanho(optionsTamanho);
        setOptionsCondicao(optionsCondicao);
      })
      .catch(error => {
        console.error('Erro ao buscar as roupas:', error);
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

  const Header = () => {
    const handleNavigateAgendamentos = () => {
      if (userToUse) {
        navigate(`/agendamentos/${userId}`, { state: { userId: userToUse.id, name: userToUse.name } });
      } else {
        console.warn('Usuário não encontrado para navegação.'); 
      }
    };

    const handleNavigateLogout = () => {
      navigate('/login');
    }

    return (
      <header className={styles.header}>
        <nav>
          <ul>
            <li><a onClick={handleNavigateAgendamentos}>Agendamentos</a></li>
            <li><a onClick={() => navigate(`/Contato/${userId}`, { state: { userId: userToUse?.id, name: userToUse?.name } })}>
                Contato
              </a></li>
            <li><a onClick={handleNavigateLogout}>Logout</a></li>
          </ul>
        </nav>
        <h1>Portal do Doador</h1>
      </header>
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'dataAgendada':
        setDataAgendada(value);
        break;
      case 'endereco':
        setEndereco(value);
        break;
      case 'cidade':
        setCidade(value);
        break;
      case 'estado':
        setEstado(value);
        break;
      case 'cep':
        setCep(value);
        break;
      case 'tipoRoupa':
        setTipoRoupa(value);
        break;
      case 'tamanhoRoupa':
        setTamanhoRoupa(value);
        break;
      case 'condicaoRoupa':
        setCondicaoRoupa(value);
        break;
      case 'quantidadeRoupa':
        setQuantidadeRoupa(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userToUse || !estado) {
      console.error('Usuário não encontrado ou estado não preenchido.');
      return;
    }

    const dataCatalog = {
      tipo: tipoRoupa,
      tamanho: tamanhoRoupa,
      condicao: condicaoRoupa,
      quantidade: quantidadeRoupa,
    };

    try {
      const responseCatalog = await axios.post('http://localhost:8000/api/v1/catalog/', dataCatalog, config);
      const catalogItem = responseCatalog.data;

      const dataColeta = {
        endereco,
        cidade,
        estado,
        cep,
      };

      const responseColeta = await axios.post('http://localhost:8000/api/v1/point/', dataColeta, config);
      const point = responseColeta.data;
      const formattedDate = dataAgendada.replace('T', ' ');
      const dataDonation = {
        doador_id: userToUse.id,
        ponto_coleta_id: point.id,
        data_hora_agendada: formattedDate,
      };

      const responseDonation = await axios.post('http://localhost:8000/api/v1/donation/', dataDonation, config);
      console.log('Doação criada com sucesso:', responseDonation.data);
      setDonation(responseDonation.data);
      setMessage('Doação criada com sucesso! Você pode seguir o andamento da doação pelo agendamento.');
      setShowNotification(true);
    } catch (error) {
      setMessage('Erro ao criar doação');
      setShowNotification(true);
    }
  };  

  const handleNotificationClose = () => {
    setShowNotification(false);
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
            <select name="tipoRoupa" value={tipoRoupa} onChange={handleInputChange}>
              {optionsTipo.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <label>Tamanho da roupa(s):</label>
            <select name="tamanhoRoupa" value={tamanhoRoupa} onChange={handleInputChange}>
              
              {optionsTamanho.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <label>Condição da roupa:</label>
            <select name="condicaoRoupa" value={condicaoRoupa} onChange={handleInputChange}>
             
              {optionsCondicao.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <label>Quantidade:</label>
            <input
              type="number"
              name="quantidadeRoupa"
              value={quantidadeRoupa}
              onChange={handleInputChange}
            />
            <h3>Agende a data da coleta</h3>
            <label>Data e Hora Agendada:</label>
            <input
              type="datetime-local"
              name="dataAgendada"
              value={dataAgendada}
              onChange={handleInputChange}
            />
            <label>Endereço:</label>
            <input
              type="text"
              name="endereco"
              value={endereco}
              onChange={handleInputChange}
            />
            <label>Cidade:</label>
            <input
              type="text"
              name="cidade"
              value={cidade}
              onChange={handleInputChange}
            />
            <label>Estado:</label>
            <select
              name="estado"
              value={estado}
              onChange={handleInputChange}
            >
              <option value="">Selecione o Estado</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            <label>CEP:</label>
            <InputMask
              mask="99999-999"
              name="cep"
              value={cep}
              onChange={handleInputChange}
              className={styles.inputMask}
            />
            <button type="submit">Agendar</button>
          </form>
        </section>
      </main>
      <Footer />
      {showNotification && <Notification message={message} onClose={handleNotificationClose} />}
    </div>
  );
};

export default PortalDoador;
