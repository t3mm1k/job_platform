import React from "react";
const MarketplaceSelection = ({
  selectedMarketplace,
  onChange,
  placeholder
}) => {
  const marketplaces = [{
    id: 'Wildberries',
    label: 'WILDBERRIES',
    image: '/img/marketplace-logo/Wildberries.png'
  }, {
    id: 'Yandex',
    label: 'Я. МАРКЕТ',
    image: '/img/marketplace-logo/Yandex.png'
  }, {
    id: 'Ozon',
    label: 'OZON',
    image: '/img/marketplace-logo/Ozon.png'
  }, {
    id: 'Avito',
    label: 'AVITO',
    image: '/img/marketplace-logo/Avito.png'
  }, {
    id: 'Boxberry',
    label: 'BOXBERRY',
    image: '/img/marketplace-logo/Boxberry.png'
  }];
  const handleMarketplaceButtonClick = e => {
    const marketplace = e.currentTarget.value;
    if (marketplace) {
      onChange({
        target: {
          name: "marketplace",
          value: marketplace === selectedMarketplace ? "" : marketplace
        }
      });
    } else {
      console.error("Marketplace button has no value attribute.");
    }
  };
  return <div className="flex flex-col gap-[5px] mb-[15px]">
            <label className={`block text-[8px] opacity-50 ${placeholder ? 'text-[#EE003B] opacity-100' : ''}`}>Маркетплейс *</label>
            <div className="flex flex-wrap gap-2">
                {marketplaces.map(m => <button key={m.id} className={`
                            flex
                            flex-1
                            bg-[color:var(--second-background-color)]
                            text-[color:var(--text-color)]
                            gap-[7px]
                            font-bold
                            text-[8px]
                            uppercase
                            rounded-[10px]
                            border-[solid]
                            border
                            p-[5px]
                            items-center
                            justify-center
                            min-w-[100px]
                            ${selectedMarketplace === m.id ? "border-white" : "border-[color:var(--second-background-color)]"}
                        `} type="button" value={m.id} onClick={handleMarketplaceButtonClick} style={{
        cursor: "pointer"
      }}>
                        <img src={m.image} alt={m.label} className="max-w-[25] max-h-[25px] rounded-full" />
                        <span>{m.label}</span>
                    </button>)}
            </div>
            <label className={`block text-[8px] opacity-50`}>Другое</label>
            <div className="flex flex-wrap gap-2">
                <button key="Others" className={`
                        flex
                        flex-1
                        bg-[color:var(--second-background-color)]
                        text-[color:var(--text-color)]
                        gap-[7px]
                        font-bold
                        text-[8px]
                        uppercase
                        rounded-[10px]
                        border-[solid]
                        border
                        p-[5px]
                        items-center
                        justify-center
                        min-w-[100px]
                        ${selectedMarketplace === 'Others' ? "border-white" : "border-[color:var(--second-background-color)]"}
                    `} type="button" value="Others" onClick={handleMarketplaceButtonClick} style={{
        cursor: "pointer",
        maxWidth: "calc(50% - 3px)"
      }}>
                    <img src={'/img/marketplace-logo/Others.png'} alt={'Другое'} className="max-w-[25] max-h-[25px] rounded-full" />
                    <span>Бренды и сайты</span>
                </button>
            </div>
        </div>;
};
export default MarketplaceSelection;
