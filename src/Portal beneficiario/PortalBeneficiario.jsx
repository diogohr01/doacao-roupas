import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PortalBeneficiario.module.css'; // Supondo que você tenha um arquivo CSS para estilos

const PortalBeneficiario = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state.userId;
  const name = location.state.name;
  const [catalog, setCatalog] = useState([]);
  const [users, setUsers] = useState([]);
  const [userToUse, setUserToUse] = useState(null);
  const [optionsTipo, setOptionsTipo] = useState([]);
  const [optionsTamanho, setOptionsTamanho] = useState([]);
  const [optionsCondicao, setOptionsCondicao] = useState([]);
  const [quantities, setQuantities] = useState({});

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

  const getUniqueValues = (array, key) => {
    return [...new Set(array.map(item => item[key]))];
  };

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

  const Header = () => {
    const handleNavigateAgendamentos = () => {
      if (userToUse) {
        navigate(`/agendamentos/${userId}`, { state: { userId: userToUse.id, name: userToUse.name } });
      } else {
        console.warn('Usuário não encontrado para navegação.');
      }
    };

    return (
      <header className={styles.header}>
        <nav>
          <ul>
            <li><a onClick={handleNavigateAgendamentos}>Agendamentos</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </nav>
        <h1>Portal do Doador</h1>
      </header>
    );
  };

  const handleQuantityChange = (id, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: value
    }));
  };

  const handleSubmit = () => {
    const pedido = catalog.map(item => ({
      id: item.id,
      quantidade: quantities[item.id] || 0
    })).filter(item => item.quantidade > 0);

    console.log("Pedido:", pedido);

    axios.post('http://localhost:8000/api/v1/pedidos/', { pedido, userId }, config)
      .then(response => {
        console.log('Pedido enviado com sucesso:', response.data);
        alert('Pedido enviado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao enviar pedido:', error);
        alert('Erro ao enviar pedido.');
      });
  };

  const CatalogCard = ({ item }) => (
    <div className={styles.card}>
      <h3>{item.nome}</h3>
      <p>Tipo: {item.tipo}</p>
      <p>Tamanho: {item.tamanho}</p>
      <p>Condição: {item.condicao}</p>
      <p>Quantidade disponível: {item.quantidade}</p>
      <input
        type="number"
        min="0"
        placeholder="Quantidade desejada"
        value={quantities[item.id] || ''}
        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
      />
    </div>
  );

  return (
    <div>
      <Header />
      <h1>ID do usuário logado: {userId}</h1>
      <h1>Nome do Usuário: {name}</h1>
      <div className={styles.catalogContainer}>
        {catalog.map(item => (
          <CatalogCard key={item.id} item={item} />
        ))}
      </div>
      <button onClick={handleSubmit} className={styles.submitButton}>Fazer Pedido</button>
    </div>
  );
};

export default PortalBeneficiario;
