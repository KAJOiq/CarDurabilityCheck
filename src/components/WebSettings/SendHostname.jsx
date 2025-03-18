import React, { useEffect } from "react";

const SendHostname = () => {
  useEffect(() => {
    const sendHostnameToBackend = () => {
      const hostname = window.location.hostname;
      fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostname }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Hostname sent successfully:', data);
        })
        .catch(error => {
          console.error('Error sending hostname:', error);
        });
    };

    sendHostnameToBackend();
  }, []);

  return null;
};

export default SendHostname;