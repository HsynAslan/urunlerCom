import SellerSidebar from '../components/SellerSidebar';

const SellerDashboard = () => {
  return (
    <div className="flex">
      <SellerSidebar />
      <div className="flex-1 p-4 ml-[30%] max-w-[70%]">
        <h1 className="text-2xl font-bold mb-4">Mağaza Paneli</h1>
        {/* İleride buraya route’a göre içerikler gelecek */}
        <p>Buraya ürün yönetimi, tema seçimi vs. gelecek</p>
      </div>
    </div>
  );
};

export default SellerDashboard;
