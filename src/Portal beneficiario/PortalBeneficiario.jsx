import { useLocation } from 'react-router-dom';

const PortalBeneficiario = () => {
  const location = useLocation();
  const userId = location.state.userId;
  const name = location.state.name

  return (
    <div>
      <h1>ID do usuário logado: {userId}</h1>
      <h1>Nome do Usuário: {name}</h1>
    </div>
  );
};

export default PortalBeneficiario