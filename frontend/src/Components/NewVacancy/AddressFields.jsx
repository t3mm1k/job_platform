import React from "react";
import Input from "./Input";
const AddressFields = ({
  addressData,
  onChange
}) => {
  return <div className="">
            <Input label="Адрес" name="address.address" value={addressData.address} onChange={onChange} />
        </div>;
};
export default AddressFields;
