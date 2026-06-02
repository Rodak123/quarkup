(async () => {
    const main = document.getElementById("main");
    try {
        const response = await fetch("/html/index.html");

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const contents = await response.text();
        main.innerHTML = contents;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }

  const toggleThemeBtn = document.getElementById('toggle-theme-btn');
  toggleThemeBtn.onclick = () => {
    const body = document.body;

    if (body.classList.contains('light')) {
      body.classList.remove('light');
      body.classList.add('dark');
    } else { 
      body.classList.remove('dark');
      body.classList.add('light');
    }
  };
})();