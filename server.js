const express = require("express");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const openai = require("openai");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const cors = require("cors");
const messages = [];
const rl = readline.createInterface({ input, output });
dotenv.config();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const instanceOpenAi = new openai.OpenAI({
  apiKey: process.env.SECRET_KEY,
});

async function main(input) {
  messages.push({ role: "user", content: input });
  console.log(messages);
  const chatCompletion = await instanceOpenAi.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });

  return chatCompletion.choices[0]?.message?.content;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html"));
});

app.post("/api", async (req, res) => {
  const mes = await main(req.body.input);
  res.json({ success: true, message: mes });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
