import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './contato.module.css';

const Contato = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || null;
  const name = location.state?.name || null;
  const [descricao, setDescricao] = useState('');
  const [stars, setStars] = useState(0);
  const [users, setUsers] = useState([]);
  const [userToUse, setUserToUse] = useState(null);
  const [averageRate, setAverageRate] = useState(null);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token c867237febd767a365d6ccea936b549944ef9548`,
    },
  };

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/v1/accounts/', config)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar usuários:', error);
      });

    axios
      .get('http://localhost:8000/api/v1/feedback/rate/', config)
      .then((response) => {
        setAverageRate(response.data.rate);
      })
      .catch((error) => {
        console.error('Erro ao buscar a média de feedback:', error);
      });
  }, []);

  useEffect(() => {
    if (users.length > 0 && name) {
      const foundUser = users.find((user) => user.name === name);
      if (foundUser) {
        setUserToUse(foundUser);
      } else {
        console.warn(`Usuário com o nome '${name}' não encontrado.`);
      }
    }
  }, [users, name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userToUse) {
      console.error('Usuário não encontrado.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/feedback/',
        { doador: userToUse.id, descricao, stars },
        config
      );
      alert('Feedback enviado:');
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    }
  };

  const handleStarChange = (event) => {
    setStars(parseInt(event.target.value));
  };

  return (
    <div className={styles.feedbackForm}>
      <h2>Deixe seu Feedback</h2>
      <p>Sobre nós</p>
      <h3>
        Nossa missão neste momento difícil é ajudar a quem mais precisa. Se você foi uma dessas pessoas, deixe seu feedback aqui. Adoraríamos ouvir o que você tem a contar!
      </h3>
      {averageRate !== null && (
        <div className={styles.rateDisplay}>Média de Avaliação: {averageRate}</div>
      )}
      <form onSubmit={handleSubmit}>
        <br />
        <label>
          Insira seu feedback aqui:
          <textarea
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
          />
        </label>
        <div className={styles.rating}>
          <input type="radio" name="star" id="star1" value="5" onChange={handleStarChange} />
          <label htmlFor="star1" />
          <input type="radio" name="star" id="star2" value="4" onChange={handleStarChange} />
          <label htmlFor="star2" />
          <input type="radio" name="star" id="star3" value="3" onChange={handleStarChange} />
          <label htmlFor="star3" />
          <input type="radio" name="star" id="star4" value="2" onChange={handleStarChange} />
          <label htmlFor="star4" />
          <input type="radio" name="star" id="star5" value="1" onChange={handleStarChange} />
          <label htmlFor="star5" />
        </div>
        <br />
        <button type="submit">Enviar</button>
        <button type="button" onClick={() => navigate(-1)}>
          Fechar
        </button>
      </form>
      <h2>Ajudando a quem precisa</h2>
    </div>
  );
};

export default Contato;
