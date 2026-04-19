export function buildResumeSavePayload(resumeData) {
  return {
    user_id: resumeData.user_id,
    first_name: resumeData.first_name ?? "",
    last_name: resumeData.last_name ?? "",
    experience: resumeData.experience ?? "",
    desired_salary: resumeData.desired_salary ?? "",
    phone: resumeData.phone,
    additional_info: resumeData.additional_info ?? ""
  };
}
