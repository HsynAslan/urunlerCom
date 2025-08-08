# 🛒 urunlerim.com Projesi

🔗 Canlı Site: [https://urunler-com.vercel.app/](https://urunler-com.vercel.app/)

---

## 🚀 Kurulum & Çalıştırma

# Backend kurulumu ve çalıştırma

```bash
cd backend
npm install
npm start
```


# Yeni terminal açıp frontend kurulumu ve çalıştırma

```bash
cd frontend
npm install
npm start

---

## 🧭 Genel Yol Haritası

urunlerim.com, satıcıların ürünlerini kolayca listeleyebildiği, alıcıların ise hızlıca firma ve ürün arayabileceği modern bir platformdur.

---

## 🧱 1. Proje Katmanları

| Katman             | Teknoloji / Özellik                        |
|--------------------|-------------------------------------------|
| Frontend (Web)     | React.js (Müşteri ve Alıcı arayüzü)       |
| Mobil Uygulama      | React Native (API ile tam entegrasyon)    |
| Backend            | node.js + Express                          |
| Veritabanı         | MongoDB (Cloud)                           |
| Mail Sistemi       | SMTP (Üye doğrulama, bildirim e-postaları)|
| Dosya Yükleme      | Multer + Cloudinary                        |
| Dil Desteği (i18n) | i18next (Free: Türkçe, Premium: Çoklu Dil)|
| QR Kod Üretimi     | qrcode npm paketi                          |
| Tema Önizleme      | Admin panelde tema önizleme                |
| Yetkilendirme      | JWT + Rol tabanlı erişim                   |

---

## 🏗️ 2. Kullanıcı Rolleri & Planlar

### Satıcı

**Free Plan:**

- 3 hazır tema seçeneği  
- Ürün ekleme/düzenleme  
- İletişim bilgileri girişi  
- Türkçe içerik  
- QR kod üretimi  

**Premium Plan:** *(Geliştirme aşamasında)*

- Dinamik URL’lerle ürün ve sayfa yönetimi  
- Çoklu dil desteği  
- Sipariş alma özelliği  

**Business Plan:** *(Şimdilik Pasif)*

- Özel domain (örnek: firma.com)  
- Özel tasarım (admin onaylı yazılım teklifi ile)  

---

### Alıcı

- Üyelik olmadan firma arama ve gezme  
- Premium satıcılardan sipariş verebilme *(Geliştirme aşamasında)*  
- İletişim bilgilerine erişim  

---

### Admin (Rol Bazlı)

- Site genel ayarları yönetimi  
- Satıcı bilgilerine erişim ve düzenleme  
- Tema yönetimi (CSS + Önizleme)  
- Rol yönetimi (Süper Admin, Editör, Teknik vb.)  

---

## 🧭 3. Öne Çıkan Özellikler

- **Ana Sayfa:** Firma arama (isim, kategori, şehir bazlı filtreleme), firma kartları, SEO uyumlu tasarım  
- **Satıcı Dinamik Sayfaları:** `/firmaSlug`, `/firmaSlug/urunler`, `/firmaSlug/iletisim`, `/firmaSlug/urunler/urunSlug`  
- **Ürün Sayfası:** Resim, fiyat, stok, açıklama, çoklu dil (premium), sipariş butonu (premium), QR kod  
- **Mail & Bildirim Sistemi:** Üye doğrulama, bildirim ve sipariş e-postaları  
- **Tema Yönetimi:** Admin panelde tema yükleme ve önizleme, satıcı tema seçimi  
- **Mağaza Paneli:** Ürün yönetimi, tema seçimi, istatistik görüntüleme, QR kod indirme  
- **Rol Bazlı Yetkilendirme:** Kullanıcı türüne göre erişim ve işlem yetkisi kontrolü  

---

## 🛠️ 4. Admin Paneli (İlk Öncelik)

- Genel site ayarları (logo, renk, font, dil seçenekleri, SMTP)  
- Tema yönetimi: CSS dosyası ve önizleme resmi yükleme, tema silme/güncelleme  
- Satıcı yönetimi: bilgileri görüntüleme, plan değişikliği, URL slug düzenleme, istatistikler  
- Rol yönetimi: yeni roller oluşturma, yetki tanımlama, kullanıcı rol atama  
- Plan yönetimi: free, premium, business plan ayarları  
- Mail yönetimi: şablon düzenleme, test mail gönderme  
- Gelişmiş: mağaza sipariş takibi, bildirim logları, admin aktiviteleri  

---

## 👥 5. Kullanıcı ve Rol Yapısı

- Ortak kullanıcı modeli: `is_admin`, `is_seller`, `is_customer`  
- Rol tablosu ve ilişkiler  
- Satıcı modeli: firma bilgileri, tema seçimi, ürün listesi, plan durumu, slug url  
- Alıcı modeli: favori firmalar, ziyaret geçmişi  

---

## 🛍️ 6. Mağaza Sistemi

- Satıcı panelinde ürün ekleme, düzenleme, silme  
- Tema seçimi ve önizleme  
- İletişim bilgileri düzenleme  
- Görüntülenme, aranma ve sipariş istatistikleri (premium)  
- QR kod üretimi ve indirme  
- Dinamik mağaza sayfaları:  
  - `/firmaSlug` (ana sayfa)  
  - `/firmaSlug/urunler`  
  - `/firmaSlug/iletisim`  
  - `/firmaSlug/urunler/urunSlug`  

---

## 🔍 7. Ana Sayfa & Arama (Alıcı Kısmı)

- Firma arama (isim, kategori, şehir)  
- Kategori bazlı filtreleme  
- Firma kartları gösterimi  
- SEO uyumlu firma linkleri  

---

## 📱 8. API & Mobil Uygulama

- JWT ile güvenli API erişimi  
- Firma, ürün listeleme ve detaylar  
- Sipariş işlemleri (premium) *(Geliştirme aşamasında)*  
- QR kod tarama yönlendirmesi  
- Bildirim listeleme  

---

## 🔜 9. Gelecekte Eklenecek Özellikler

- Otomatik çeviri entegrasyonları (DeepL, Google Translate API) *(Planlama aşamasında)*  
- Gerçek ödeme altyapısı (iyzico, Stripe vb.) *(Planlama aşamasında)*  
- SMS ve mobil push bildirim sistemi *(Planlama aşamasında)*  
- Business plan özel yazılım sipariş formu ve yapay zeka destekli teklif sistemi *(İleri aşamada)*  

---

## 🎯 Proje Hedefleri

- Kullanıcı dostu, hızlı ve güvenilir platform  
- Çoklu dil ve tema desteği ile kişiselleştirilebilir mağazalar  
- Modern API yapısı ile mobil ve web entegrasyonu  
- Esnek rol ve plan yönetimi ile farklı ihtiyaçlara uygun çözümler  

---

> Geliştirme süreci devam etmektedir, bazı özellikler aktif değildir veya geliştirme aşamasındadır.

---

## 📢 İletişim

Her türlü soru, öneri ve işbirliği için [iletisim@urunlerim.com](mailto:iletisim@urunlerim.com) adresinden bize ulaşabilirsiniz.

---

**urunlerim.com — Satıcılar ve Alıcılar için modern ürün ve firma platformu 🚀**

