import SellerSidebar from '../components/SellerSidebar';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import '../styles/SellerDashboard.css'; // CSS dosyasını ekle

const SellerDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-container">
      <div className="sidebar-wrapper">
        <SellerSidebar />
      </div>
       <div className="language-selector-container">
          <LanguageSelector />
        </div>

      <div className="dashboard-content">
       

        <div className="dashboard-text">
          <h1 className="dashboard-title">{t('SellerDashboard.welcome')}</h1>
          <p className="dashboard-description">{t('SellerDashboard.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
