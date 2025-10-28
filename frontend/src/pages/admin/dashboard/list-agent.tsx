import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Page from '../../../components/Page';
import HeaderCard from '../../../components/HeaderCard';
import ListAgentTable, { Agent } from '../../../sections/admin/ListAgentTable';
import axiosInstance from '@/utils/axios';


const AgentsDashboard: React.FC = () => {
  // Pseudo data for agents

  const [agents, setAgents] = useState<Agent[]>([]);

  const fetchAgents = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/agents-list');
      console.log(response.data.data);
      setAgents(response.data.data.users);

    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  }

  useEffect(() => {
    fetchAgents();
  }, []);

  const breadcrumbs = ['Dashboard', 'Analytics', 'Agents'];

  return (
    <Page title="Agents Dashboard">
        <HeaderCard
          title="Agents Management"
          subtitle="Manage and monitor all registered agents"
          breadcrumbs={breadcrumbs}
        />

        <ListAgentTable agents={agents} />
    </Page>
  );
};

export default AgentsDashboard;
