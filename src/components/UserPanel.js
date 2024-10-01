import Login from './Login';
import MaterialForm from './MaterialForm';
import { logout } from './firebase';

function UserPanel({connected, setConnected}) {

  return (
    <div> {
        !connected ? (
          <div>
            <br />
            <Login setConnected={setConnected} />
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
    }
    </div>
  );
}

export default UserPanel;