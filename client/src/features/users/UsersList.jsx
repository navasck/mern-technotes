import { useGetUsersQuery } from './usersApiSlice';
import User from './User';

// the first argument is typically used for passing variables or parameters to the query.
// 'usersList' - We will be able to see these query labels in Redux Devtools
const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // pollingInterval: 60000: Automatically refetches data every 60 seconds.
  // refetchOnFocus: true: Refetches data when the component regains focus.
  // refetchOnMountOrArgChange: true: Refetches data when the component mounts or its arguments change.

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    // this 'ids' are passing from query's transformResponse
    const { ids } = users;
    console.log('ids from UsersList Component', ids);
    // will get entities array & ids array separately
    console.log('users from UsersList Component', users);

    const tableContent = ids?.length
      ? ids.map((userId) => <User key={userId} userId={userId} />)
      : null;

    content = (
      <table className='table--users table-layout'>
        <thead className='table__thead'>
          <tr>
            <th scope='col' className='table__th user__username'>
              Username
            </th>
            <th scope='col' className='table__th user__roles'>
              Roles
            </th>
            <th scope='col' className='table__th user__edit'>
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default UsersList;
