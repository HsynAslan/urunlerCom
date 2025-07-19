// src/components/LanguageSelector.jsx
import { useTranslation } from 'react-i18next';
import { FaLanguage } from 'react-icons/fa';
import '../styles/LanguageSelector.css'; // Stil uyumu için

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="language-selector">
      <FaLanguage className="biggerIcon" />
      <select onChange={handleLanguageChange} defaultValue={i18n.language}>
        <option value="tr">Türkçe</option>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
