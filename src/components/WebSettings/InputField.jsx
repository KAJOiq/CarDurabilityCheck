import React from "react";

const InputField = ({ label, name, value, onChange, disabled }) => {
  return (
    <div className="flex flex-col">
      <label className="text-right font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="border rounded px-3 py-2"
      />
    </div>
  );
};

export default InputField;