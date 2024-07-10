import React, { useState } from "react";
import styles from './UserPost.module.css';
import { useNavigate } from "react-router-dom";
import Notification from "../portal doador/notificação";

const UserPost = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    senha: '',
    confirm_senha: '',
    birthday: '',
    is_doador: false,
    is_beneficiario: false,
    errors: {}
  });

  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, senha, confirm_senha, birthday, is_doador, is_beneficiario } = formData;

    try {
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token c867237febd767a365d6ccea936b549944ef9548`
        },
        body: JSON.stringify({ name, email, senha, confirm_senha, birthday, is_doador, is_beneficiario })
      };

      const url = 'http://127.0.0.1:8000/api/v1/accounts/';
      const response = await fetch(url, config);

      if (!response.ok) {
        const data = await response.json();
        setFormData({ ...formData, errors: data });
        return;
      }

      const data = await response.json();
      console.log('User created:', data);

      setFormData({
        name: '',
        email: '',
        senha: '',
        confirm_senha: '',
        birthday: '',
        is_doador: false,
        is_beneficiario: false,
        errors: {}
      });

      setMessage('Doação criada com sucesso! Você pode seguir o andamento da doação pelo agendamento.');
      setShowNotification(true);
      navigate('/login')
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const { name, email, senha, confirm_senha, birthday, is_doador, is_beneficiario, errors } = formData;

  return (
    <div className={styles['post-login']}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        {errors.name && <p className={styles['error-message']}>{errors.name}</p>}

        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        {errors.email && <p className={styles['error-message']}>{errors.email}</p>}

        <input
          type="password"
          name="senha"
          value={senha}
          onChange={handleInputChange}
          placeholder="Senha"
          required
        />
        {errors.senha && <p className={styles['error-message']}>{errors.senha}</p>}

        <input
          type="password"
          name="confirm_senha"
          value={confirm_senha}
          onChange={handleInputChange}
          placeholder="Confirmar Senha"
          required
        />
        {errors.confirm_senha && <p className={styles['error-message']}>{errors.confirm_senha}</p>}

        <input
          type="date"
          name="birthday"
          value={birthday}
          onChange={handleInputChange}
          placeholder="Birthday"
        />
        {errors.birthday && <p className={styles['error-message']}>{errors.birthday}</p>}

        <label>
          <input
            type="checkbox"
            name="is_doador"
            checked={is_doador}
            onChange={handleInputChange}
          />
          Doador
        </label>
        <label>
          <input
            type="checkbox"
            name="is_beneficiario"
            checked={is_beneficiario}
            onChange={handleInputChange}
          />
          Beneficiário
        </label>
        {errors.non_field_errors && <p className={styles['error-message']}>{errors.non_field_errors}</p>}
       
        <button type="submit" className={styles['submit-button']}>Criar usuário</button>
      </form>
      <a onClick= {() => navigate('/login')}>Login</a>
      {showNotification && <Notification message={message} onClose={handleNotificationClose} />}
    </div>
  );
};

export default UserPost;
