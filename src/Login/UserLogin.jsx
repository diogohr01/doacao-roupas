import React from "react";
import styles from './UserLogin.module.css';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

export default class UserLogin extends React.Component {
  state = {
    name: '',
    senha: '',
    showPassword: false,
    errors: {}
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, senha } = this.state;

    try {
      // Realiza a autenticação com POST
      const authUrl = 'http://127.0.0.1:8000/api/v1/authentication/token/';
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, senha })
      });

      if (!authResponse.ok) {
        const data = await authResponse.json();
        this.setState({ errors: data });
        return;
      }

      const authData = await authResponse.json();
      console.log('Login successful:', authData);

      // Após autenticar, obtém os detalhes do usuário com GET
      const userUrl = 'http://127.0.0.1:8000/api/v1/accounts/me/';
      const userResponse = await fetch(userUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.access}`, // Inclua o token de acesso
          'Content-Type': 'application/json',
        }
      });

      if (!userResponse.ok) {
        const data = await userResponse.json();
        this.setState({ errors: data });
        return;
      }

      const userData = await userResponse.json();
      console.log('User details:', userData);

      // Armazena tokens e redireciona após login bem-sucedido
      localStorage.setItem('access_token', authData.access);
      localStorage.setItem('refresh_token', authData.refresh);

      this.props.history.push('/dashboard');

      this.setState({
        name: '',
        senha: '',
        errors: {}
      });
    } catch (error) {
      console.error('Error logging in:', error);
      this.setState({ errors: { detail: 'Ocorreu um erro ao fazer login. Tente novamente mais tarde.' } });
    }
  };

  render() {
    const { name, senha, showPassword, errors } = this.state;

    return (
      <div className={styles['login-form-container']}>
        <div className={styles['login-form']}>
          <h2>Login</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleInputChange}
              placeholder="Nome"
              required
            />
            {errors.nome && <p className={styles['error-message']}>{errors.nome}</p>}

            <div className={styles['password-input']}>
              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                value={senha}
                onChange={this.handleInputChange}
                placeholder="Senha"   
                required
              />
              <span onClick={this.togglePasswordVisibility}>
                <Icon icon={showPassword ? eyeOff : eye} />
              </span>
            </div>
            {errors.non_field_errors && <p className={styles['error-message']}>{errors.non_field_errors}</p>}
            {errors.detail && <p className={styles['error-message']}>{errors.detail}</p>}

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }
}
