import { useState } from 'react';

interface BillingData {
  Age: number | '';
  'Billing Amount': number | '';
  Stay_Duration: number | '';
  Cost_Per_Day: number | '';
  Health_Risk_Score: number | '';
}

export default function BillingPrediction() {
  const [formData, setFormData] = useState<BillingData>({
    Age: '',
    'Billing Amount': '',
    Stay_Duration: '',
    Cost_Per_Day: '',
    Health_Risk_Score: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict_billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to predict billing amount');
      }

      setResult(data.estimated_billing);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Predict Patient Billing</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="Age">Patient Age</label>
          <input
            type="number"
            id="Age"
            name="Age"
            className="input-control"
            value={formData.Age}
            onChange={handleChange}
            placeholder="e.g. 45"
            required
            min="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="Billing Amount">Current Billing Amount ($)</label>
          <input
            type="number"
            id="Billing Amount"
            name="Billing Amount"
            className="input-control"
            value={formData['Billing Amount']}
            onChange={handleChange}
            placeholder="e.g. 25000"
            required
            min="0"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label htmlFor="Stay_Duration">Stay Duration (Days)</label>
            <input
              type="number"
              id="Stay_Duration"
              name="Stay_Duration"
              className="input-control"
              value={formData.Stay_Duration}
              onChange={handleChange}
              placeholder="e.g. 10"
              required
              min="0"
            />
          </div>

          <div className="input-group" style={{ flex: 1 }}>
            <label htmlFor="Cost_Per_Day">Cost Per Day ($)</label>
            <input
              type="number"
              id="Cost_Per_Day"
              name="Cost_Per_Day"
              className="input-control"
              value={formData.Cost_Per_Day}
              onChange={handleChange}
              placeholder="e.g. 2500"
              required
              min="0"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="Health_Risk_Score">Health Risk Score (0-10)</label>
          <input
            type="number"
            id="Health_Risk_Score"
            name="Health_Risk_Score"
            className="input-control"
            value={formData.Health_Risk_Score}
            onChange={handleChange}
            placeholder="e.g. 4.5"
            required
            step="0.1"
            min="0"
            max="10"
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Calculate Estimate'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {result !== null && (
        <div className="result-box">
          <h3>Estimated Billing</h3>
          <div className="value">
            ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </div>
  );
}
