import Login from './Login';
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
            <br />
            <button onClick={logout} className='flex right-1'>Déconnexion</button>
          </div>
        )
    }
    </div>
  );
}

export default UserPanel;