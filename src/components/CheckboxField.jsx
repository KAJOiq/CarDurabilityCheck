import React from "react";

const CheckboxField = ({ label, name, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mr-3"
      />
      <label className="text-right font-medium">{label}</label>
    </div>
  );
};

export default CheckboxField;