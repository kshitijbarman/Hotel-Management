import React from "react";

const FormInput = ({ label, id, type = "text", value, onChange, required, min, max, step, className }) => {
    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium  text-black">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                max={max}
                step={step}
                className="w-full bg-white text-black border border-slate-600 rounded-md px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default FormInput;