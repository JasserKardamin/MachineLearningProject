import { useState } from 'react';
import BillingPrediction from './components/BillingPrediction';
import BloodRecommendation from './components/BloodRecommendation';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'billing' | 'recommendation'>('billing');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ML Healthcare Portal</h1>
        <p>Leverage advanced machine learning models to predict medical billing and recommend blood priorities.</p>
      </header>

      <div className="tab-container">
        <button 
          className={`btn btn-secondary ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing Predictor
        </button>
        <button 
          className={`btn btn-secondary ${activeTab === 'recommendation' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendation')}
        >
          Blood Recommendation
        </button>
      </div>

      <main className="main-content">
        <div className="glass-card">
          {activeTab === 'billing' ? <BillingPrediction /> : <BloodRecommendation />}
        </div>
      </main>
    </div>
  );
}

export default App;
