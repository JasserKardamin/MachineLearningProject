import { useState } from 'react';

interface RecommendData {
  blood_type: string;
  age: number | '';
  condition: string;
}

export default function BloodRecommendation() {
  const [formData, setFormData] = useState<RecommendData>({
    blood_type: '',
    age: '',
    condition: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendation');
      }

      setResult(data.recommendation_priority);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example conditions based on typical medical datasets.
  // Ensure these strictly match the LabelEncoder classes
  const conditions = ["Arthritis", "Asthma", "Cancer", "Diabetes", "Hypertension", "Obesity"];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Blood Priority Recommendation</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="input-group">
          <label htmlFor="blood_type">Patient Blood Type</label>
          <select
            id="blood_type"
            name="blood_type"
            className="input-control"
            value={formData.blood_type}
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

        <div className="input-group">
          <label htmlFor="age">Patient Age</label>
          <input
            type="number"
            id="age"
            name="age"
            className="input-control"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 30"
            required
            min="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="condition">Medical Condition</label>
          <select
            id="condition"
            name="condition"
            className="input-control"
            value={formData.condition}
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

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Get Recommendation'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {result !== null && (
        <div className={`result-box ${result >= 3 ? 'success' : ''}`}>
          <h3>Priority Level</h3>
          <div className="value">
            {result}
          </div>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {result >= 3 ? 'High Priority' : 'Standard Priority'}
          </p>
        </div>
      )}
    </div>
  );
}
