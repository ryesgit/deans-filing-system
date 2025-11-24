import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { filesAPI } from "../../services/api";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "48px",
    borderColor: state.isFocused ? "#4A90E2" : "#E0E0E0",
    boxShadow: state.isFocused ? "0 0 0 1px #4A90E2" : "none",
    "&:hover": {
      borderColor: "#4A90E2",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled
      ? "#f5f5f5"
      : state.isSelected
      ? "#4A90E2"
      : state.isFocused
      ? "#F0F7FF"
      : "white",
    color: state.isDisabled
      ? "#999"
      : state.isSelected
      ? "white"
      : "#333",
    padding: "12px 16px",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? 0.6 : 1,
    "&:active": {
      backgroundColor: state.isDisabled ? "#f5f5f5" : "#4A90E2",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333",
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
        status: file.status || "AVAILABLE",
        isDisabled: file.status && file.status !== "AVAILABLE",
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
        console.log('File selected:', {
          fileName: selectedOption.label,
          department: selectedOption.department,
          fileCategory: selectedOption.category
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
      isOptionDisabled={(option) => option.isDisabled}
      noOptionsMessage={({ inputValue }) =>
        inputValue.length < 2
          ? "Type at least 2 characters to search"
          : "No files found"
      }
      loadingMessage={() => "Searching files..."}
      formatOptionLabel={(option) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {option.label}
            {option.isDisabled && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "0.75em",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                {option.status}
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.85em", color: "#666", marginTop: "2px" }}>
            {option.department} • {option.category}
            {option.isDisabled && " • Not available for request"}
          </div>
        </div>
      )}
    />
  );
};

export default FileSearchInput;
