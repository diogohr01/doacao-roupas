import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import UserPost from './cadastro/UserPost';
import UserLogin from './Login/UserLogin';
import App from './App';
import Teste from './portal/Portal';

const router = createBrowserRouter([
  {path: "/cadastro", element: <UserPost/>},
  {path: "*", element: <h1>Não existe nada aqui</h1>},
  {path: "/Login", element: <UserLogin/>},
  {path: "/teste/:id", element: <Teste />, id: ':id' },
])


const root = ReactDOM.createRoot(document.getElementById('root'));  
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);