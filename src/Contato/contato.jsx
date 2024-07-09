import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './contato.module.css';

const Contato = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token cab1c9c2bd96e108f7c3695ea1af98f0abc9a1a9`
    }
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`Feedback enviado: ${name} - ${email} - ${feedback}`);
    
    try {
      const response = await axios.post('/api/feedback', { name, email, feedback }, config);
      console.log(response.data);
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const handleReturn = () => {
    navigate('/beneficiario'); // Navega para a página de contato
  };

  return (
    <div className={styles.feedbackForm}>
      <button onClick={handleReturn}>Retornar</button>
      <h2>Deixe seu Feedback</h2>
      <p>Sobre nós</p>
      <h3>
        Nossa missão neste momento dificil é ajudar a quem mais precisa, se você foi uma dessas pessoas deixe seu feedback aqui adorariamos ouvir o que você tem a contar!
      </h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <label>
          Enter your feedback here:
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Enviar</button>
        <button type="button" onClick={() => console.log('Close clicked!')}>Close</button>
      </form>
      <h2>Ajudando a quem precisa</h2>
    </div>
  );
};

export default Contato;
