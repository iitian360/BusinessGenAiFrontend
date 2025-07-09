import React, { useState } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import ComplaintForm from '../forms/ComplaintForm';

const RaiseComplaint = () => {
  const [loading, setLoading] = useState(false);
  const { raiseComplaint } = useComplaints();

  const handleSubmit = async (data) => {
    setLoading(true);
    const result = await raiseComplaint(data);
    setLoading(false);
    return result;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Raise a Complaint</h2>
      <ComplaintForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default RaiseComplaint;