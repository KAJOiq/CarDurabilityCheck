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

    if (response.status === 401) {
      localStorage.setItem("sessionExpired", "انتهت صلاحية الجلسة، يرجى تسجيل الدخول.");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      window.location.href = "/login";
  
        return { isSuccess: false, message: "انتهت صلاحية الجلسة، سيتم إعادة التوجيه..." };
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  };
  
  export default fetchData;
  