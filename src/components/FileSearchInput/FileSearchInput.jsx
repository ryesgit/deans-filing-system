import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { filesAPI } from "../../services/api";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: "55px",
    width: "100%",
    padding: "0 0.25rem",
    border: `3px solid ${state.isFocused ? "#800000" : "#d9d9d9"}`,
    borderRadius: "16px",
    fontFamily: '"Poppins", Helvetica',
    fontSize: "16px",
    color: "#1e1e1e",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(128, 0, 0, 0.1)" : "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "#ffffff",
    "&:hover": {
      borderColor: "#800000",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#c2c2c2",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#4A90E2"
      : state.isFocused
      ? "#F0F7FF"
      : "white",
    color: state.isSelected ? "white" : "#333",
    padding: "12px 16px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#4A90E2",
    },
    fontFamily: '"Poppins", Helvetica',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e1e1e",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#800000" : "#c2c2c2",
    "&:hover": {
      color: "#800000",
    },
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    fontFamily: '"Poppins", Helvetica',
    fontSize: "14px",
    color: "#666",
    padding: "12px 16px",
  }),
};

const FileSearchInput = ({ value, onChange, onFileSelect }) => {
  const [inputValue, setInputValue] = useState("");

  const loadOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    try {
      const response = await filesAPI.search(inputValue);
      const files = response.data.files || response.data;

      return files.map((file) => ({
        value: file.id,
        label: file.filename || file.name,
        department: file.department,
        category: file.category || "Uncategorized",
        fileData: file,
      }));
    } catch (error) {
      console.error("Error searching files:", error);
      return [];
    }
  };

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      onChange(selectedOption.label);
      if (onFileSelect) {
        console.log("File selected:", {
          fileName: selectedOption.label,
          department: selectedOption.department,
          fileCategory: selectedOption.category,
        });
        onFileSelect({
          fileName: selectedOption.label,
          department: selectedOption.department,
          fileCategory: selectedOption.category,
          fileData: selectedOption.fileData,
        });
      }
    } else {
      onChange("");
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    return newValue;
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      onChange={handleChange}
      onInputChange={handleInputChange}
      value={value ? { label: value, value: value } : null}
      placeholder="Search for a file..."
      isClearable
      styles={customStyles}
      noOptionsMessage={({ inputValue }) =>
        inputValue.length < 2
          ? "Type at least 2 characters to search"
          : "No files found"
      }
      loadingMessage={() => "Searching files..."}
      formatOptionLabel={(option) => (
        <div>
          <div style={{ fontWeight: 500 }}>{option.label}</div>
          <div style={{ fontSize: "0.85em", color: "#666", marginTop: "2px" }}>
            {option.department} • {option.category}
          </div>
        </div>
      )}
    />
  );
};

export default FileSearchInput;
