import React from 'react';
import '../styles/Spinner.css'; // CSS'yi ayrıca oluşturacağız

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
