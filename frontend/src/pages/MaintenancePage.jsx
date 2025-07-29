import React from 'react';

const MaintenancePage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="/images/bakim.gif"
          alt="Site Bakımda Animasyonu"
          style={styles.video}
        />
        <h1 style={styles.title}>🛠️ Site Bakımda</h1>
        <p style={styles.text}>
          Kısa bir süreliğine bakımdayız. Lütfen birazdan tekrar deneyin.
        </p>
      </div>
      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} urunler.com — Sabırla beklediğiniz için teşekkürler!
      </footer>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
    textAlign: 'center',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '40px 30px',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    maxWidth: '420px',
    width: '100%',
    backdropFilter: 'blur(8px)',
  },
  video: {
    width: '120px',
    height: '120px',
    marginBottom: '25px',
    borderRadius: '50%',
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.7)',
    objectFit: 'cover',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '15px',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  text: {
    fontSize: '1.2rem',
    lineHeight: '1.5',
    opacity: 0.85,
  },
  footer: {
    marginTop: 'auto',
    fontSize: '0.9rem',
    opacity: 0.6,
  },
};

export default MaintenancePage;
