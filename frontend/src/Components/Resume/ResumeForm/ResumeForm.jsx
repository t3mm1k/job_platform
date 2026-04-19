import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { connect, useSelector, useDispatch } from "react-redux";
import FormField from "../FormField/FormField";
import { updateResume, updateUserResume } from "../../../store/slices/userSlice";
function formatPhone(value) {
  let cleaned = ('' + value).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = '+' + cleaned.substring(1).replace(/[^\d]/g, '');
  } else {
    cleaned = cleaned.replace(/[^\d]/g, '');
  }
  if (cleaned.startsWith('8')) {
    cleaned = '+7' + cleaned.substring(1);
  } else if (cleaned.length === 10 && cleaned.startsWith('9')) {
    cleaned = '+7' + cleaned;
  } else if (!cleaned.startsWith('+') && cleaned.length > 0) {
    cleaned = '+' + cleaned;
  }
  const match = cleaned.match(/^(\+?\d{1,1})?(\d{0,3})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/);
  if (!match) {
    return value;
  }
  let formatted = '';
  if (match[1]) formatted += match[1];
  if (match[2]) formatted += (formatted.length > 1 ? ' ' : '') + match[2];
  if (match[3]) formatted += (match[2].length === 3 ? ' ' : '') + match[3];
  if (match[4]) formatted += (match[3].length === 3 ? '-' : '') + match[4];
  if (match[5]) formatted += (match[4].length === 2 ? '-' : '') + match[5];
  return formatted.substring(0, 16);
}
function ResumeFormComponent({
  isTgMiniApp,
  updateResume
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [formData, setFormData] = useState({
    first_name: user.resume.first_name || "",
    last_name: user.resume.last_name || "",
    phone: user.resume.phone || "",
    experience: user.resume.experience || "",
    desired_salary: user.resume.desired_salary || "",
    additional_info: user.resume.additional_info || ""
  });
  useEffect(() => {
    setFormData({
      first_name: user.resume.first_name || "",
      last_name: user.resume.last_name || "",
      phone: user.resume.phone || "",
      experience: user.resume.experience || "",
      desired_salary: user.resume.desired_salary || "",
      additional_info: user.resume.additional_info || ""
    });
  }, [user.resume]);
  const handleChange = e => {
    const {
      id,
      value
    } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: id === "phone" ? formatPhone(value) : value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (document.activeElement) {
      document.activeElement.blur();
    }
    const resumeData = {
      ...formData
    };
    try {
      const updatedResume = await updateResume({
        ...resumeData,
        user_id: user.id
      });
      alert('Резюме сохранено!');
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка при сохранении резюме:", error);
      alert('Ошибка при сохранении резюме');
    }
  };
  return <div className="w-full flex flex-col gap-0">
            <header className="relative flex items-center mb-5">
                {isTgMiniApp === false && <button className="flex items-center justify-center gap-[5px] text-[0.8rem]" onClick={() => navigate(-1)}>
                        <img src="/img/icons/arrow-left.svg" alt="Назад" />
                        Назад
                    </button>}
                <h1 className="whitespace-nowrap text-[1rem] font-semibold ml-auto mr-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Резюме</h1>
            </header>

            <form className="space-y-6">
                <FormField id="first_name" label="ИМЯ" value={formData.first_name} handleChange={handleChange} />

                <FormField id="last_name" label="ФАМИЛИЯ" value={formData.last_name} handleChange={handleChange} />

                <FormField id="phone" label="ТЕЛЕФОН ДЛЯ СВЯЗИ" type="tel" placeholder="+7-XXX-XXX-XX-XX" value={formData.phone} handleChange={handleChange} />

                <FormField id="experience" label="ОПЫТ РАБОТЫ" type="textarea" rows={5} placeholder="Мой опыт состоит из..." value={formData.experience} handleChange={handleChange} />

                <FormField id="desired_salary" label="ЖЕЛАЕМАЯ ЗАРПЛАТА" placeholder="Интересует доход от..." value={formData.desired_salary} handleChange={handleChange} />

                <FormField id="additional_info" label="ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ" type="textarea" rows={6} placeholder="Также хочу рассказать..." value={formData.additional_info} handleChange={handleChange} />
                <p className="text-center text-[8px] opacity-80">
                    {`Резюме отправится работодателю, если вы откликнетесь на вакансию*`}
                </p>

                <div className=""> {}
                    <button type="button" onClick={handleSubmit} className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition duration-200 text-[8px] uppercase tracking-wider">
                        Сохранить
                    </button>
                </div>
            </form>
        </div>;
}
const mapStateToProps = state => ({
  isTgMiniApp: state.ui.isTgMiniApp,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  updateResume: data => dispatch(updateResume(data)),
  updateUserResume: data => dispatch(updateUserResume(data))
});
const ResumeForm = connect(mapStateToProps, mapDispatchToProps)(ResumeFormComponent);
export default ResumeForm;
