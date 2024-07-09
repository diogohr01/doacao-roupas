import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PortalBeneficiario.module.css';

const PortalBeneficiario = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state.userId;
  const name = location.state.name;
  const [catalog, setCatalog] = useState([]);
  const [users, setUsers] = useState([]);
  const [userToUse, setUserToUse] = useState(null);
  const [quantidades, setQuantidades] = useState({}); // Estado para quantidades individuais

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
    axios.get('http://localhost:8000/api/v1/catalog/', config)
      .then(response => {
        setCatalog(response.data);
        // Inicializar quantidades para cada item no catálogo
        const initialQuantities = {};
        response.data.forEach(item => {
          initialQuantities[item.id] = 0; // Quantidade inicial de cada item é zero
        });
        setQuantidades(initialQuantities);
      })
      .catch(error => {
        console.error('Erro ao buscar as roupas:', error);
      });
  }, []);

  const handleQuantidadeChange = (itemId, value) => {
    const parsedValue = parseInt(value, 10); // Converter o valor para um número inteiro
    
    // Verificar se o valor é um número válido maior ou igual a zero
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      // Atualizar o estado quantidades com a nova quantidade para o item específico
      setQuantidades((prevQuantidades) => ({
        ...prevQuantidades,
        [itemId]: parsedValue, // Update the quantity for this specific item
      }));
    } else {
      // Se o valor não for válido, definir a quantidade como zero
      setQuantidades((prevQuantidades) => ({
        ...prevQuantidades,
        [itemId]: 0, // Reset the quantity for this specific item
      }));
    }
  };
  
  const handleSubmit = () => {
    const pedido = catalog.map((item) => {
      const quantity = document.querySelector(`input[name="quantidade-${item.id}"]`).value;
      return { id: item.id, quantidade: parseInt(quantity, 10) };
    });

    if (pedido.length === 0) {
      alert('Nenhum item selecionado.');
      return;
    }

    axios.post('http://localhost:8000/api/v1/donation/', { pedido, userId }, config)
      .then(response => {
        console.log('Pedido enviado com sucesso:', response.data);
        alert('Pedido enviado com sucesso!');
        updateCatalogQuantities(pedido);
      })
      .catch(error => {
        console.error('Erro ao enviar pedido:', error);
        alert('Erro ao enviar pedido.');
      });
  };

  const updateCatalogQuantities = (pedido) => {
    pedido.forEach(item => {
      const updatedQuantity = catalog.find(catalogItem => catalogItem.id === item.id).quantidade - item.quantidade;
      axios.patch(`http://localhost:8000/api/v1/catalog/${item.id}/`, { quantidade: updatedQuantity }, config)
        .then(response => {
          console.log('Quantidade atualizada no backend:', response.data);
          
          // Atualizar localmente o estado do catálogo após confirmação do backend
          setCatalog(prevCatalog => prevCatalog.map(catalogItem => {
            if (catalogItem.id === item.id) {
              return {
                ...catalogItem,
                quantidade: updatedQuantity
              };
            }
            return catalogItem;
          }));
        })
        .catch(error => {
          console.error('Erro ao atualizar quantidade no catálogo:', error);
        });
    });
  };

  const CatalogCard = ({ item }) => {
    const [quantity,setQuantity] = useState(0); // Add a local state for each item's quantity

    const handleQuantityChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 0) {
        setQuantity(value);
      } else {
        setQuantity(0);
      }
    };

    return (
      <div className={styles.card}>
        <h3>{item.nome}</h3>
        <p>Tipo: {item.tipo}</p>
        <p>Tamanho: {item.tamanho}</p>
        <p>Condição: {item.condicao}</p>
        <p>Quantidade disponível: {item.quantidade}</p>
        <input
          type="number"
          name={`quantidade-${item.id}`} // Nome único para cada input
          min="0"
          max={item.quantidade} // Limite máximo baseado na quantidade disponível
          value={quantity}
          onChange={handleQuantityChange}
          onKeyDown={(e) => e.preventDefault()} // Impedir redirecionamento
        />
      </div>
    );
  };

  return (
    <div>
      <header className={styles.header}>
        <nav>
          <ul>
            <li><a onClick={() => navigate(`/agendamentos/${userId}`, { state: { userId: userToUse?.id, name: userToUse?.name } })}>Agendamentos</a></li>
            <li><a onClick={() => navigate(`/Contato/${userId}`, { state: { userId: userToUse?.id, name: userToUse?.name } })}>Contato</a></li>
            
          </ul>
        </nav>
        <h1>Portal do Beneficiário</h1>
      </header>
      <h1>ID do usuário logado: {userId}</h1>
      <h1>Nome do Usuário: {name}</h1>
      <div className={styles.catalogContainer}>
        {catalog.map(item => (
          <CatalogCard key={item.id} item={item} />
        ))}
      </div>
      <button onClick={handleSubmit} className={styles.submitButton}>Confirmar Doação</button>
    </div>
  );
};

export default PortalBeneficiario;