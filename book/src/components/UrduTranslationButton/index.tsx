
import React, { useState } from 'react';
import styles from './styles.module.css';

interface UrduTranslationButtonProps {
  textToTranslate?: string; // Optional text to translate
}

const UrduTranslationButton: React.FC<UrduTranslationButtonProps> = ({ textToTranslate }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!textToTranslate) {
      setError("No text provided for translation.");
      return;
    }

    setIsTranslating(true);
    setError(null);
    setTranslatedText(null);

    try {
      const response = await fetch('http://localhost:8000/translate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToTranslate, target_language: 'Urdu' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className={styles.translationContainer}>
      <button onClick={handleTranslate} disabled={isTranslating || !textToTranslate} className={styles.translateButton}>
        {isTranslating ? 'Translating...' : 'Translate to Urdu'}
      </button>
      {error && <p className={styles.errorText}>{error}</p>}
      {translatedText && (
        <div className={styles.translatedOutput}>
          <h3>Urdu Translation:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default UrduTranslationButton;
