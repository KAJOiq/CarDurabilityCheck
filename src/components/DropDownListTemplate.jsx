import { useState, useEffect, useCallback } from 'react';
import fetchData from '../utils/fetchData';
import Select from 'react-select';

const DropDownListTemplate = ({
  endpoint,
  queryParams,
  labelKey,
  valueKey,
  onSelect,
  placeholder,
  disabled
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (endpoint === "find-vehicle-name" && !queryParams.brandId) {
        setItems([]); 
        return;
      }

      const params = {
        ...queryParams,
        page: 0,
        pageSize: 5000,
      };

      const result = await fetchData(`admin/lookup/${endpoint}?${new URLSearchParams(params)}`);
      
      if (result && result.results && Array.isArray(result.results.result)) {
        setItems(result.results.result); 
      } else {
        setItems([]);
      }
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, queryParams, labelKey, valueKey]);

  
  useEffect(() => {
    loadData();
  }, [loadData]);

  const options = items.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));

  return (
    <div className="relative">
      <Select
        options={options}
        placeholder={placeholder}
        isLoading={loading}
        isDisabled={disabled || loading}
        onChange={(selectedOption) => {
          if (selectedOption) {
            const selectedItem = items.find(item => item[valueKey] === selectedOption.value);
            onSelect(selectedItem);
          }
        }}
        noOptionsMessage={() => (error ? `خطأ: ${error}` : "لا توجد خيارات متاحة")}
        styles={{
          control: (provided) => ({
            ...provided,
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '0.25rem',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3b82f6' : 'white',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': {
              backgroundColor: '#93c5fd', 
              color: 'black',
            },
          }),
          singleValue: (provided) => ({
            ...provided,
            color: 'black', 
          }),
        }}
      />
    </div>
  );
};

export default DropDownListTemplate;