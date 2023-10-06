document.addEventListener('DOMContentLoaded', function () {
    // Hide the loading screen when the page is fully loaded
    window.addEventListener('load', function () {
      const loadingScreen = document.getElementById('loading-screen');
      loadingScreen.style.display = 'none';
    });
  });
  
  function displayUTCTime() {
    const utcTimeElement = document.getElementById('utc-time');

    function updateUTC() {
        const now = new Date();
        const hour = now.getUTCHours().toString().padStart(2, '0');
        const minute = now.getUTCMinutes().toString().padStart(2, '0');
        const second = now.getUTCSeconds().toString().padStart(2, '0');

        const timeString = `${hour}:${minute}:${second} UTC`;

        utcTimeElement.textContent = timeString;
    }

    updateUTC();
    setInterval(updateUTC, 1000);
}

displayUTCTime();