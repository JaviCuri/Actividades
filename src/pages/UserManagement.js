import React from 'react';

function UserManagement() {
  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <ul>
        <li>Usuario1 - Activo <button>Bloquear</button></li>
        <li>Usuario2 - Inactivo <button>Habilitar</button></li>
      </ul>
    </div>
  );
}

export default UserManagement;