import './App.css';

import { Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout.jsx';
import Public from './Components/Public.jsx';
import Login from './features/auth/Login.jsx';
import DashLayout from './Components/DashLayout.jsx';
import Welcome from './features/auth/Welcome.jsx';
import NotesList from './features/notes/NotesList.jsx';
import UsersList from './features/users/UsersList.jsx';
import EditUser from './features/users/EditUser.jsx';
import NewUserForm from './features/users/NewUserForm.jsx';
import EditNote from './features/notes/EditNote.jsx';
import NewNote from './features/notes/NewNote.jsx';
import Prefetch from './features/auth/Prefetch.jsx';
import PersistLogin from './features/auth/PersistLogin';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path='dash' element={<DashLayout />}>
              <Route index element={<Welcome />} />

              <Route path='users'>
                <Route index element={<UsersList />} />
                <Route path=':id' element={<EditUser />} />
                <Route path='new' element={<NewUserForm />} />
              </Route>

              <Route path='notes'>
                <Route index element={<NotesList />} />
                <Route path=':id' element={<EditNote />} />
                <Route path='new' element={<NewNote />} />
              </Route>
            </Route>
            {/* End Dash */}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
