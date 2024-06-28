import React, { useState } from 'react';
import styles from './UserLogin.module.css';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'name': setName(value);
        break;
      case 'senha': setSenha(value);
        break; default: break;
    }
  };

  const togglePasswordVisibility = () => { setShowPassword(!showPassword); };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const config = {

        headers: {


          'Content-Type': 'application/json',

          'Authorization': `Token 06d074d8acee898dc5e4e203efd89487f23bda8a`

        }

      };


      const userUrl = 'http://127.0.0.1:8000/api/v1/accounts/me/'; // Add trailing slash

      const userData = { name, senha };


      const response = await fetch(userUrl, {

        method: 'POST',

        headers: config.headers,

        body: JSON.stringify(userData)

      });


      if (response.ok) {

        const user = await response.json();

        const userId = user.id; // Armazena o ID do usuário logado



        setErrors({});

      } else {

        const data = await response.json();

        setErrors(data);

        console.log(data)

      }


      const userBuscar = 'http://127.0.0.1:8000/api/v1/accounts/';

      const responseBuscar = await fetch(userBuscar, {
        method: 'GET',
        headers: config.headers
      });


      if (responseBuscar.ok) {
        const users = await responseBuscar.json();
        const user = users.find(user => user.name === name);
        const userName = user.name
        if (user && user.id) { 
          if (user.is_doador === true) {
            navigate(`/doador/${user.id}`, { state: { userId: user.id, name: userName } });
          } else if (user.is_beneficiario === true) {
            navigate(`/beneficiario/${user.id}`, { state: { userId: user.id, name: userName } });
          }
        } else {
          setErrors({ detail: 'Usuário não encontrado.' });
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrors({ detail: 'Ocorreu um erro ao fazer login. Tente novamente mais tarde.' });
    }

  };

  return (
    <div className={styles['login-form-container']}>
      <div className={styles['login-form']}>
        <h2>Login</h2> <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={name} onChange={handleInputChange} placeholder="Nome" required /> {errors.name && <p className={styles['error-message']}>{errors.name}</p>}

          <div className={styles['password-input']}>

            <input

              type={showPassword ? "text" : "password"}

              name="senha"

              value={senha}

              onChange={handleInputChange}

              placeholder="Senha"

              required

            />

            <span onClick={togglePasswordVisibility}>

              <Icon icon={showPassword ? eyeOff : eye} />

            </span>

          </div>

          {errors.senha && <p className={styles['error-message']}>{errors.senha}</p>}

          {errors.detail && <p className={styles['error-message']}>{errors.detail}</p>}


          <button type="submit">Login</button>

        </form>

      </div>

    </div>

  );
};

export default UserLogin;