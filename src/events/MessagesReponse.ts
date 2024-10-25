import config from "../config";
import ClientBot from "../utility/ClientBot";
import { WASocket } from "@whiskeysockets/baileys";

const MessagesReponse = (sock: WASocket, client: ClientBot) => {
  sock.ev.on("messages.upsert", async (msg) => {
    const message = msg.messages[0];
    if (message.key.fromMe || !message.message) return;

    const messageContent = message.message.conversation || "";
    if (!messageContent) {
      await sock.sendMessage(message.key.remoteJid as string, { text: "Maaf, sedang ada gangguan. Coba lagi nanti ya!" });
      return;
    }

    const messages = messageContent.split(config.prefix);
    if (messages[0] === "sah") {
      const command = client.commandCollection.get(messages[1].trim().toLowerCase());
      command ? command.execute(message, sock) : await sock.sendMessage(message.key.remoteJid as string, { text: "Maaf, perintah tidak ditemukan!" });
    } else {
      await sock.sendMessage(message.key.remoteJid as string, { text: "Maaf, perintah tidak ditemukan!" });
    }
  });
};

export default MessagesReponse;
