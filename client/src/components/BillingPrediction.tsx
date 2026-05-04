import { useState } from 'react';

interface BillingData {
  Age: number | '';
  Stay_Duration: number | '';
  Medical_Condition: string;
  Blood_Type: string;
}

export default function BillingPrediction() {
  const [formData, setFormData] = useState<BillingData>({
    Age: '',
    Stay_Duration: '',
    Medical_Condition: '',
    Blood_Type: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'Age' || name === 'Stay_Duration') ? (value === '' ? '' : Number(value)) : value 
    }));
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

  const conditions = ["Arthritis", "Asthma", "Cancer", "Diabetes", "Hypertension", "Obesity"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Predict Patient Billing</h2>
      <form onSubmit={handleSubmit}>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-group" style={{ flex: 1 }}>
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
        </div>

        <div className="input-group">
          <label htmlFor="Medical_Condition">Medical Condition</label>
          <select
            id="Medical_Condition"
            name="Medical_Condition"
            className="input-control"
            value={formData.Medical_Condition}
            onChange={handleChange}
            required
            style={{ appearance: 'none', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
          >
            <option value="" disabled>Select condition...</option>
            {conditions.map(cond => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="Blood_Type">Blood Type</label>
          <select
            id="Blood_Type"
            name="Blood_Type"
            className="input-control"
            value={formData.Blood_Type}
            onChange={handleChange}
            required
            style={{ appearance: 'none', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
          >
            <option value="" disabled>Select blood type...</option>
            {bloodTypes.map(bt => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>
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
