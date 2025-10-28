import React, { useEffect, useState } from 'react';
import Page from '../../../components/Page';
import HeaderCard from '../../../components/HeaderCard';
import ListUserTable, { User } from '../../../sections/admin/ListUserTable';
import axiosInstance from '@/utils/axios';


const UsersDashboard: React.FC = () => {
  // Pseudo data for users

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/users-list');
      console.log(response.data.data);
      setUsers(response.data.data.users);

    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const breadcrumbs = ['Dashboard', 'Analytics', 'Users'];

  return (
    <Page title="Users Dashboard">
        <HeaderCard
          title="Users Management"
          subtitle="Manage and monitor all registered users"
          breadcrumbs={breadcrumbs}
        />

        <ListUserTable users={users} />
    </Page>
  );
};

export default UsersDashboard;

