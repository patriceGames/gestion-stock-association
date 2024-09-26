import Login from './Login';
import MaterialForm from './MaterialForm';
import {useState} from 'react';
import { logout } from './firebase';

function UserPanel({connected, setConnected}) {
  const [panelOpened, setPanelOpened] = useState(false);

  return (
    <div> {
      !panelOpened ? (
        <div>
          <button onClick={() => setPanelOpened(true)}>User Panel</button>
        </div>
      )
      : (
        !connected ? (
          <div>
            <br />
            <Login setConnected={setConnected} />
            <br />
            <button onClick={() => setPanelOpened(false)}>Close Panel</button>
          </div>
        )
        :
        (
          <div>
            <MaterialForm />
            <br />
            <button onClick={logout}>Déconnexion</button>
          </div>
        )
      )
    }
    </div>
  );
}

export default UserPanel;