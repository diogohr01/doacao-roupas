import React from "react";
import styles from './UserPost.module.css';

export default class UserPost extends React.Component {
  state = { 
    name: '',
    email: '',
    senha: '',
    confirm_senha: '',
    birthday: '',
    is_doador: false,
    is_beneficiario: false,
    errors: {} 
  };

  handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    this.setState({ [name]: type === 'checkbox' ? checked : value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, senha, confirm_senha, birthday, is_doador, is_beneficiario } = this.state;

    

    try {
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token 06d074d8acee898dc5e4e203efd89487f23bda8a`
        },
        body: JSON.stringify({ name, email, senha, confirm_senha, birthday, is_doador, is_beneficiario })
      };

      const url = 'http://127.0.0.1:8001/api/v1/accounts/';
      const response = await fetch(url, config);

      if (!response.ok) {
        const data = await response.json();
        this.setState({ errors: data }); 
        return;
      }

      const data = await response.json();
      console.log('User created:', data);

      this.setState({
        name: '',
        email: '',
        senha: '',
        confirm_senha: '',
        birthday: '',
        is_doador: false,
        is_beneficiario: false,
        errors: {} 
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  render() {
    const { name, email, senha, confirm_senha, birthday, is_doador, is_beneficiario, errors } = this.state;

    return (
      <div className={styles['post-login']}>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleInputChange}
            placeholder="Name"
            required
          />
          {errors.name && <p className={styles['error-message']}>{errors.name}</p>}

          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleInputChange}
            placeholder="Email"
            required
          />
          {errors.email && <p className={styles['error-message']}>{errors.email}</p>}

          <input
            type="password"
            name="senha"
            value={senha}
            onChange={this.handleInputChange}
            placeholder="Senha"
            required
          />
          {errors.senha && <p className={styles['error-message']}>{errors.senha}</p>}

          <input
            type="password"
            name="confirm_senha"
            value={confirm_senha}
            onChange={this.handleInputChange}
            placeholder="Confirmar Senha"
            required
          />
          {errors.confirm_senha && <p className={styles['error-message']}>{errors.confirm_senha}</p>}

          <input
            type="date"
            name="birthday"
            value={birthday}
            onChange={this.handleInputChange}
            placeholder="Birthday"
          />
          {errors.birthday && <p className={styles['error-message']}>{errors.birthday}</p>}

          <label>
            <input
              type="checkbox"
              name="is_doador"
              checked={is_doador}
              onChange={this.handleInputChange}
            />
            Doador
          </label>
          <label>
            <input
              type="checkbox"
              name="is_beneficiario"
              checked={is_beneficiario}
              onChange={this.handleInputChange}
            />
            Beneficiário
          </label>
          {errors.non_field_errors && <p className={styles['error-message']}>{errors.non_field_errors}</p>}

          <button type="submit" className={styles['submit-button']}>Criar usuário</button>
        </form>
      </div>
    );
  }
}
