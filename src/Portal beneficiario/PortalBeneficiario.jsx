import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PortalBeneficiario.module.css';
import InputMask from 'react-input-mask';
import calcaImage from '../Portal beneficiario/calca.jpg';
import bermudaImage from '../Portal beneficiario/bermuda.jpeg';
import casacoImage from '../Portal beneficiario/casaco.jpeg';
import camisetaImage from '../Portal beneficiario/camiseta_branca.jpg'

// Objeto associando tipos de itens com suas respectivas imagens
const tipoToImage = {
  'camiseta': camisetaImage,
  'calca': calcaImage,
  'bermuda': bermudaImage,
  'casaco': casacoImage,
  // Adicione mais tipos conforme necessário
};

const PortalBeneficiario = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state.userId;
  const name = location.state.name;
  const [catalog, setCatalog] = useState([]);
  const [users, setUsers] = useState([]);
  const [userToUse, setUserToUse] = useState(null);
  const [quantidades, setQuantidades] = useState({});
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [dataAgendada, setDataAgendada] = useState('');
  const [cep, setCep] = useState('');
  const [point, setPoint] = useState(null);

  const estados = [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
    "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
    "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
    "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
  ];
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token c867237febd767a365d6ccea936b549944ef9548`
    }
  };
  
  const Footer = () => {
    return (
      <footer className={styles.footer}>
        <p>&copy; 2024 Portal de doação - SOS RS</p>
      </footer>
    );
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
        // Inicializa quantidades para cada item no catálogo
        const initialQuantities = {};
        response.data.forEach(item => {
          initialQuantities[item.id] = 0;
        });
        setQuantidades(initialQuantities);
      })
      .catch(error => {
        console.error('Erro ao buscar roupas:', error);
      });
  }, []);

  const handleQuantidadeChange = (itemId, value) => {
    setQuantidades(prevQuantidades => ({
      ...prevQuantidades,
      [itemId]: value,
    }));
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'endereco':
        setEndereco(value);
        break;
      case 'cidade':
        setCidade(value);
        break;
      case 'estado':
        setEstado(value);
        break;
      case 'dataAgendada':
        setDataAgendada(value);
        break;
      case 'cep':
        setCep(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const pedido = catalog.filter(item => quantidades[item.id] > 0)
                          .map(item => ({
                             id: item.id,
                             quantidade: quantidades[item.id],
                           }));
  
    if (pedido.length === 0) {
      alert('Nenhum item selecionado.');
      return;
    }
  
    const dataColeta = {
      endereco,
      cidade,
      estado,
      cep,
    };
    const formattedDate = dataAgendada.replace('T', ' ');
    axios.post('http://localhost:8000/api/v1/point/', dataColeta, config)
      .then(response => {
        setPoint(response.data);
  
        pedido.forEach(item => {
          console.log(item)
          const dataDonation = {
            doador_id: userToUse.id,
            ponto_coleta_id: response.data.id,
            data_hora_agendada: formattedDate,
            catalog: item.id,
            quantidade: item.quantidade,
          };
  
          axios.post('http://localhost:8000/api/v1/donation/', dataDonation, config)
            .then(response => {
              console.log('Pedido enviado com sucesso:', response.data);
              updateCatalogQuantities(item);
              return item.quantidade === 0;
            })
            .catch(error => {
              console.error('Erro ao enviar pedido:', error);
            });
        });
  
        alert('Pedido enviado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao enviar pedido:', error);
        alert('Erro ao enviar pedido.');
      });
  };
  
  const updateCatalogQuantities = item => {
    const updatedQuantity = catalog.find(catalogItem => catalogItem.id === item.id).quantidade - item.quantidade;
    axios.patch(`http://localhost:8000/api/v1/catalog/${item.id}/`, { quantidade: updatedQuantity }, config)
      .then(response => {
        console.log('Quantidade atualizada no backend:', response.data);
        setCatalog(prevCatalog =>
          prevCatalog.map(catalogItem =>
            catalogItem.id === item.id ? { ...catalogItem, quantidade: updatedQuantity } : catalogItem
          )
        );
      })
      .catch(error => {
        console.error('Erro ao atualizar quantidade no catálogo:', error);
      });
  };

  return (
    <div>
      <header className={styles.header}>
        <nav>
          <ul>
            <li>
              <a onClick={() => navigate(`/agendamentos/${userId}`, { state: { userId: userToUse?.id, name: userToUse?.name } })}>
                Agendamentos
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/Contato/${userId}`, { state: { userId: userToUse?.id, name: userToUse?.name } })}>
                Contato
              </a>  
            </li>
            <li>
              <a onClick={() => navigate('/login')}>
                Logout
              </a>
            </li>
          </ul>
        </nav>
        <h1>Portal do Beneficiário</h1>
      </header>
      <h1>Bem vindo! {name}</h1>
      <div className={styles.catalogContainer}>
        {catalog.map(item => (
          <CatalogCard key={item.id} item={item} handleQuantidadeChange={handleQuantidadeChange} />
        ))}
      </div>
      <div className={styles.point}>
        <label>Endereço para coleta:</label>
        <input type="text" name="endereco" placeholder="Rua, número, bairro" value={endereco} onChange={handleInputChange} />
        <label>Cidade:</label>
        <input type="text" name="cidade" value={cidade} onChange={handleInputChange} />
        <label>Estado:</label>
        <select name="estado" value={estado} onChange={handleInputChange}>
          <option value="">Selecione o estado</option>
          {estados.map(estado => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
        <label>Data do agendamento:</label>
        <input
          type="datetime-local"
          id="meeting-time"
          name="dataAgendada"
          value={dataAgendada}
          onChange={handleInputChange}
        />
        <label>CEP:</label>
        <InputMask
          mask="99999-999"
          value={cep}
          onChange={handleInputChange}
        >
          {(inputProps) => <input {...inputProps} type="text" name="cep" />}
        </InputMask>
      </div>
      <button onClick={handleSubmit} className={styles.submitButton}>Confirmar Doação</button>
      <Footer/>
    </div>
  );
};

const CatalogCard = ({ item, handleQuantidadeChange }) => {
  
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChangeLocal = e => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
      handleQuantidadeChange(item.id, value);
    } else {
      setQuantity(0);
      handleQuantidadeChange(item.id, 0);
    }
  };

  return (
    <div className={styles.card}>
      <img src={tipoToImage[item.tipo]} alt={`Imagem de ${item.tipo}`} className={styles.itemImage} />
      <h3>{item.nome}</h3>
      <p>Tipo: {item.tipo}</p>
      <p>Tamanho: {item.tamanho}</p>
      <p>Condição: {item.condicao}</p>
      <p>Quantidade disponível: {item.quantidade}</p>
      <input
        type="number"
        name={`quantidade-${item.id}`}
        min="0"
        max={item.quantidade}
        value={quantity}
        onChange={handleQuantityChangeLocal}
        onKeyDown={e => e.preventDefault()}
      />
    </div>
  );
};

export default PortalBeneficiario;
