import React, { Suspense, lazy, useState } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy load components
const PostManager = lazy(() => import('../components/admin/PostManager'));
const ComplaintManager = lazy(() => import('../components/admin/ComplaintManager'));
const CommentManager = lazy(() => import('../components/admin/CommentManager'));
const Analytics = lazy(() => import('../components/admin/Analytics'));

const TABS = [
  { label: 'Posts', icon: '📝' },
  { label: 'Complaints', icon: '🚨' },
  { label: 'Comments', icon: '💬' },
  { label: 'Analytics', icon: '📊' },
];

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const TabPanel = ({ children, value, index }) => (
    <div className={`${value !== index ? 'hidden' : ''} py-6`}>
      {value === index && (
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          {children}
        </Suspense>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Mobile Dropdown */}
      <div className="sm:hidden mb-4">
        <select
          value={tabValue}
          onChange={(e) => setTabValue(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        >
          {TABS.map((tab, index) => (
            <option key={index} value={index}>
              {tab.icon} {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex border-b border-gray-200 mb-4">
        <nav className="flex space-x-4">
          {TABS.map((tab, index) => (
            <button
              key={index}
              onClick={() => setTabValue(index)}
              className={`flex items-center gap-2 px-4 py-1 rounded-lg transition font-medium
                text-sm sm:text-base md:text-lg whitespace-nowrap cursor-pointer
                ${tabValue === index
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white shadow-md rounded-b-md p-4 mt-0">
        <TabPanel value={tabValue} index={0}>
          <PostManager />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ComplaintManager />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <CommentManager />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Analytics />
        </TabPanel>
      </div>
    </div>
  );
};

export default AdminDashboard;