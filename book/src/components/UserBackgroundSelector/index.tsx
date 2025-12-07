import React from 'react';
import { useUser } from '@site/src/contexts/UserContext';
import styles from './styles.module.css'; // Assuming a CSS module for styling

const UserBackgroundSelector: React.FC = () => {
  const { softwareBackground, setSoftwareBackground } = useUser();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBackground = event.target.value as 'Beginner' | 'Intermediate' | 'Expert';
    setSoftwareBackground(selectedBackground);
  };

  return (
    <div className={styles.selectorContainer}>
      <label htmlFor="software-background-select" className={styles.label}>
        My background:
      </label>
      <select
        id="software-background-select"
        className={styles.select}
        value={softwareBackground || ''}
        onChange={handleChange}
      >
        <option value="" disabled>Select...</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Expert">Expert</option>
      </select>
    </div>
  );
};

export default UserBackgroundSelector;
