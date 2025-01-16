export const submitForm = async (formData) => {
    const response = await fetch("https://api.example.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    if (!response.ok) {
      throw new Error("Failed to submit the form");
    }
  
    return await response.json();
  };
  