import React, { useEffect, useState } from 'react';
import Page from '../../../components/Page';
import HeaderCard from '../../../components/HeaderCard';
import ListApproveProperty, { Property } from '../../../sections/admin/ListApproveProperty';
import axiosInstance from '../../../utils/axios';

const ApprovePropertiesDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/properties/inactive-by-users');
      console.log(response.data.data);
      setProperties(response.data.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  const breadcrumbs = ['Dashboard', 'Properties', 'Approve Properties'];

  return (
    <Page title="Approve Properties">
      <HeaderCard
        title="Property Approval"
        subtitle="Review and approve properties submitted by users"
        breadcrumbs={breadcrumbs}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ListApproveProperty properties={properties} />
      )}
    </Page>
  );
};

export default ApprovePropertiesDashboard;

