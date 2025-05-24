import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css'; // Import your CSS styles

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
        <div className='notfound-content'>
      <h1>404</h1>
      <h2>Sayfa bulunamadı</h2>
      <p>
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link to="/">Ana Sayfaya Dön</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
