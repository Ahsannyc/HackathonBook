import React from 'react';
import Link from '@docusaurus/Link';

function UrduTranslationButton() {
  const handleTranslate = () => {
    // Placeholder for actual translation logic
    alert('Urdu translation triggered!');
  };

  return (
    <Link
      className="button button--secondary button--sm"
      onClick={handleTranslate}
      style={{ marginLeft: '10px' }}
    >
      اردو
    </Link>
  );
}

export default UrduTranslationButton;
