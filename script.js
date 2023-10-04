document.addEventListener('DOMContentLoaded', function () {
    // Hide the loading screen when the page is fully loaded
    window.addEventListener('load', function () {
      const loadingScreen = document.getElementById('loading-screen');
      loadingScreen.style.display = 'none';
    });
  });
  