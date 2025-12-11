import React, { useState } from 'react';

interface BackgroundQuestionnaireProps {
  onSubmit: (backgroundData: {
    softwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    hardwareExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    primaryFocus: 'software' | 'hardware' | 'both' | 'theory';
    backgroundDetails?: string;
  }) => void;
  initialData?: {
    softwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    hardwareExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    primaryFocus?: 'software' | 'hardware' | 'both' | 'theory';
    backgroundDetails?: string;
  };
  loading?: boolean;
}

const BackgroundQuestionnaire: React.FC<BackgroundQuestionnaireProps> = ({
  onSubmit,
  initialData = {},
  loading = false
}) => {
  const [formData, setFormData] = useState({
    softwareExperience: initialData.softwareExperience || 'beginner',
    hardwareExperience: initialData.hardwareExperience || 'beginner',
    primaryFocus: initialData.primaryFocus || 'both',
    backgroundDetails: initialData.backgroundDetails || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="background-questionnaire">
      <h3>User Background Questionnaire</h3>
      <p>Please provide information about your experience to personalize your content:</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="softwareExperience">Software Experience</label>
          <select
            id="softwareExperience"
            name="softwareExperience"
            value={formData.softwareExperience}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="hardwareExperience">Hardware Experience</label>
          <select
            id="hardwareExperience"
            name="hardwareExperience"
            value={formData.hardwareExperience}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="primaryFocus">Primary Focus Area</label>
          <select
            id="primaryFocus"
            name="primaryFocus"
            value={formData.primaryFocus}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="software">Software</option>
            <option value="hardware">Hardware</option>
            <option value="both">Both</option>
            <option value="theory">Theory</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="backgroundDetails">Additional Background Details</label>
          <textarea
            id="backgroundDetails"
            name="backgroundDetails"
            value={formData.backgroundDetails}
            onChange={handleChange}
            disabled={loading}
            placeholder="Tell us more about your technical background..."
            rows={3}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </form>
    </div>
  );
};

export default BackgroundQuestionnaire;