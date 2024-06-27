import { useLocation } from 'react-router-dom';

const Teste = () => {
  const location = useLocation();
  const userId = location.state.userId;

  return (
    <div>
      <h1>ID do usuário logado: {userId}</h1>
    </div>
  );
};

export default Teste