function Marketplace({
  marketplace
}) {
  let logoSrc = '';
  switch (marketplace) {
    case 'Wildberries':
      logoSrc = '/img/marketplace-logo/Wildberries.png';
      break;
    case 'Yandex':
      logoSrc = '/img/marketplace-logo/Yandex.png';
      break;
    case 'Ozon':
      logoSrc = '/img/marketplace-logo/Ozon.png';
      break;
    case 'Avito':
      logoSrc = '/img/marketplace-logo/Avito.png';
      break;
    case 'Boxberry':
      logoSrc = '/img/marketplace-logo/Boxberry.png';
      break;
    case 'Others':
      logoSrc = '/img/marketplace-logo/Others.png';
      break;
    default:
      logoSrc = '/img/marketplace-logo/Others.png';
  }
  return <div className="flex justify-center items-center h-auto bg-[var(--second-background-color)] gap-[10px] rounded-[10px]">
            <img src={logoSrc} alt={marketplace} className="w-[40px] rounded-full p-[5px]" />
            <p className="font-[700] uppercase">{marketplace === 'Others' ? 'Бренды и сайты' : marketplace}</p>
        </div>;
}
export default Marketplace;
