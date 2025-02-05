const fetchData = async (url, options = {}, headers = {}) => {
    const token = localStorage.getItem("accessToken");
    const isFormData = options.body instanceof FormData;
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    };
  
    const response = await fetch(`http://localhost:5273/api/${url}`, {
      ...options,
      headers: defaultHeaders,
    });
  
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  };
  
  export default fetchData;
  