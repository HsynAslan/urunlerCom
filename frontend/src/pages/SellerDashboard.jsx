import { useTranslation } from 'react-i18next';
import '../styles/SellerDashboard.css';

const SellerDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="seller-dashboard-container">
      <h1>{t('SellerDashboard.title')}</h1>
      <ul className="seller-dashboard-goals">
        <li>{t('SellerDashboard.goal1')}</li>
        <li>{t('SellerDashboard.goal2')}</li>
        <li>{t('SellerDashboard.goal3')}</li>
        <li>{t('SellerDashboard.goal4')}</li>
      </ul>
    </div>
  );
};

export default SellerDashboard;
