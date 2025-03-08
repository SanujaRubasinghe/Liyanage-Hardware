import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function UserProfile() {
    const {user, logout} = useContext(AuthContext)

    return(
        <div>
            <h1>User Profile</h1>
            <h2>Username: {user.username}</h2>
            <h2>Email: {user.email}</h2>
            <button className='login-button' onClick={logout}>Log out</button>
        </div>
    )
}

export default UserProfile