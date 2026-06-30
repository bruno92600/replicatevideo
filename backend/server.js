require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Replicate = require("replicate");

const app = express();

app.use(cors());
app.use(express.json());

const replicate = new Replicate();

app.post("/api/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log(prompt);

    const output = await replicate.run("minimax/video-01", {
      input: {
        prompt: prompt,
        prompt_optimizer: true,
      },
    });

    console.log("replicate generation completed", { output });

    let videoLink = "";

    if (output && typeof output.url === "function") {
      videoLink = output.url();
    } else if (Array.isArray(output)) {
      videoLink = output[0];
    } else {
      videoLink = output;
    }

    res.json({ videoUrl: videoLink });
  } catch (error) {
    console.error("[Exception]:", error);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(3000, () =>
  console.log("Serveur lancé sur le port 3000"),
);
server.setTimeout(600000);
