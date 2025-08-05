import { useState, useEffect } from 'react';
import dashboardAPI from '../utils/dashboard-api';

export default function TestAPI() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<any[]>([]);

  const runTests = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Starting API tests...');
      const results = await dashboardAPI.testAllEndpoints();
      setTestResults(results);
      
      // Also get some sample data
      const campaigns = await dashboardAPI.getCampaignEffect();
      setCampaignData(campaigns.slice(0, 3)); // First 3 items
      
    } catch (error) {
      console.error('Test failed:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Auto-run tests on page load
    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 TBWA Scout Dashboard - API Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTests}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Run API Tests'}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>📊 Test Results</h2>
        {Object.keys(testResults).length === 0 ? (
          <p>No tests run yet...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {Object.entries(testResults).map(([name, success]) => (
              <div
                key={name}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: success ? '#d4edda' : '#f8d7da',
                  color: success ? '#155724' : '#721c24'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>
                  {success ? '✅' : '❌'} {name}
                </div>
                <div style={{ fontSize: '12px' }}>
                  {success ? 'SUCCESS' : 'FAILED'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {campaignData.length > 0 && (
        <div>
          <h2>📈 Sample Campaign Data</h2>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Campaign</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Brand</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Revenue Impact</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ROI %</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Effectiveness</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {campaign.campaign_name}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {campaign.brand_name}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      ${campaign.total_revenue_impact?.toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {campaign.roi_pct}%
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {campaign.effectiveness_score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>🔍 Environment Check</h3>
        <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
        <p><strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Open browser console to see detailed API call logs.</p>
      </div>
    </div>
  );
}