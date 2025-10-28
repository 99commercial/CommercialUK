import React, { useEffect, useState } from 'react';
import Page from '../../../components/Page';
import HeaderCard from '../../../components/HeaderCard';
import ListPropertiesTable, { Property } from '../../../sections/admin/ListPropertiesTable';
import axiosInstance from '../../../utils/axios';

const PropertiesDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  const fetchProperties = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/properties');
      console.log(response.data.data);
      setProperties(response.data.data.properties);

    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  const breadcrumbs = ['Dashboard', 'Analytics', 'Properties'];

  return (
    <Page title="Properties Dashboard">
        <HeaderCard
          title="Properties Management"
          subtitle="Manage and monitor all listed properties"
          breadcrumbs={breadcrumbs}
        />

        <ListPropertiesTable properties={properties} />
    </Page>
  );
};

export default PropertiesDashboard;

