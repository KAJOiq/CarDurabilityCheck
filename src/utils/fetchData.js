const fetchData = async (url, options = {}, headers = {}) => {
  try {
      const token = localStorage.getItem('accessToken');
      const isFormData = options.body instanceof FormData;
      const defaultHeaders = {
          'Authorization': `Bearer ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...headers,
      };

      const response = await fetch(
          `http://localhost:5273/api/${url}`,
          { ...options, headers: defaultHeaders }
      );

      if (!response.ok) {
          let errorBody;
          try {
              errorBody = await response.json();
          } catch {
              throw new Error(`انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول`);
          }
          throw new Error(errorBody.message || `انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : {};
  } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
  }
};

export default fetchData;
