import React from 'react';

const CustomerHome = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Müşteri Paneli</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-xl font-semibold">🎯 Hedeflerimiz</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Satıcılardan ürünleri görüntüleme</li>
            <li>Ürünleri favorilere ekleyebilme</li>
            <li>Satıcılara soru sorabilme</li>
            <li>Sipariş oluşturabilme ve takip edebilme</li>
            <li>Kullanıcı profili üzerinden kişisel bilgileri yönetme</li>
            <li>Güvenli ödeme ve iade süreci takibi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
