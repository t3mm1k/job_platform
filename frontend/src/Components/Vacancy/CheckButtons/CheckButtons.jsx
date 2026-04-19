import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCenter } from "../../../store/slices/vacanciesSlice";
import { useState } from "react";
import PhotoSlider from "./PhotoSlider";
function CheckButtons({
  photo,
  coordinates
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSlider, setShowSlider] = useState(false);
  const handleShowOnMap = () => {
    dispatch(setCenter([coordinates.longitude, coordinates.latitude]));
    navigate("/");
  };
  const handleShowPhotos = () => {
    setShowSlider(true);
  };
  const handleCloseSlider = () => {
    setShowSlider(false);
  };
  return <div className="flex gap-[10px] font-[700]">
            {photo.length > 0 ? <button onClick={handleShowPhotos} className="text-[8px] rounded-[10px] border-2 border-white  bg-[var(--first-background-color)] text-white px-[10px] py-[7px] flex-grow w-[0%]">
                    Посмотреть фото
                </button> : null}
            <button onClick={handleShowOnMap} className="text-[8px] rounded-[10px] border-2 border-white  bg-white text-[var(--first-background-color)] px-[10px] py-[7px] flex-grow w-[0%]">
                Посмотреть на карте
            </button>

            {showSlider && <PhotoSlider photos={photo} onClose={handleCloseSlider} />}
        </div>;
}
export default CheckButtons;
