import CheckButtons from "../CheckButtons/CheckButtons";
function InfoLabel({
  label,
  text,
  photo,
  coordinates
}) {
  return <div className="flex flex-col text-[12px] text-white font-[700] gap-[2px]">
            <span className="opacity-50 text uppercase text-[0.7em]">{label}</span>
            <span>{text}</span>
            {label === "Место работы" ? <CheckButtons photo={photo} coordinates={coordinates} /> : null}
        </div>;
}
export default InfoLabel;
