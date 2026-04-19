import Option from "../Option/Option";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
function OptionsForm({
  selectedCompanyId
}) {
  const favorites = useSelector(state => state.user.favorites);
  const vacancies = useSelector(state => state.vacancies.data);
  const favoriteVacancies = vacancies.filter(vacancy => favorites.includes(vacancy._id) && vacancy.is_active === true);
  const navigate = useNavigate();
  const types = selectedCompanyId !== null ? ["mycompany", "help"] : ["resume", "favorites", "help"];
  return <div className="flex flex-col w-full overflow-auto gap-2 relative z-0">
            {types.map((type, index) => {
      switch (type) {
        case "favorites":
          return <Option key={type} index={index} type={type} label="Избранное" value={favoriteVacancies.length} onClick={() => navigate(`/${type}`)} />;
        case "help":
          return <Option key={type} index={index} type={type} label="Помощь" value="" onClick={() => window.open('https://t.me/fisner115', '_blank')} />;
        case "resume":
          return <Option key={type} index={index} type={type} label="Мое резюме" value="" onClick={() => navigate(`/${type}`)} />;
        case "mycompany":
          return <Option key={type} index={index} type={type} label="Моя компания" value="" onClick={() => navigate(`/${type}`)} />;
        default:
          return null;
      }
    })}
        </div>;
}
export default OptionsForm;
