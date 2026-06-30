document
  .getElementById("generatorForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const promptInput = document.getElementById("promptText");
    const promptText = promptInput.value.trim();
    const generateBtn = document.getElementById("generateBtn");
    const chatFeed = document.getElementById("chatFeed");
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (!promptText) {
      alert("veuillez entrer une description");
      return;
    }

    if (welcomeMessage) welcomeMessage.style.display = "none";

    generateBtn.disabled = true;
    promptInput.disabled = true;

    const userRow = document.createElement("div");
    userRow.className = "chat-row user";
    userRow.innerHTML = `<div class='chat-content'>
    <div class='avatar'>U</div>
    <div class='message-body'>${promptText}</div>
    </div>`;

    chatFeed.appendChild(userRow);

    const aiRow = document.createElement("div");
    aiRow.className = "chat-row ai";
    const uniqueId = "ai-msg" + Date.now();
    aiRow.innerHTML = `<div class='chat-content'>
    <div class='avatar'>IA</div>
    <div class='message-body' id='${uniqueId}'>
    <div class='spinner'></div>
    <span>Compilation de votre vidéo... (prendra environ 2-3 minute)</span>
    </div>
    </div>`;

    chatFeed.appendChild(aiRow);

    chatFeed.scrollTop = chatFeed.scrollHeight;
    promptInput.value = "";

    try {
      const response = await fetch(
        "https://video-generator-backend-g5sw.onrender.com/api/generate-video",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ prompt: promptText }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération.");
      }

      const targetMessageBody = document.getElementById(uniqueId);
      targetMessageBody.innerHTML = `<p>Générée avec succès:</p>
      <div class='video-container'>
      <video controls autoplay loop src="${data.videoUrl}"></video>
      <a href="${data.videoUrl}" target="_blank" download class='download-btn'>Télécharger la vidéo</a>
      </div>
      `;
    } catch (error) {
      document.getElementById(uniqueId).innerHTML =
        `<span style='color: red;'>Une erreur est survenue: ${error.message}</span>`;
    } finally {
      generateBtn.disabled = false;
      promptInput.disabled = false;
      promptInput.focus();
    }
  });
