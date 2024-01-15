import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

const NewNote = () => {
    const users = useSelector(selectAllUsers)

    if (!users.length) return <p>Not Currently available</p>;

    // const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>
    const content = <NewNoteForm users={users} />;

    return content
}
export default NewNote