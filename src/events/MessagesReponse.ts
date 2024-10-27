import config from "../config";
import ClientBot from "../utility/ClientBot";
import { WASocket } from "@whiskeysockets/baileys";

const MessagesReponse = (sock: WASocket, client: ClientBot) => {
  sock.ev.on("messages.upsert", async (msg) => {
    const message = msg.messages[0];
    if (message.key.fromMe || !message.message) return;

    const messageContent = (message.message.conversation || "").toLowerCase();
    if (!messageContent) return;

    // const isGroup = message.key.remoteJid?.includes("-") || false;
    const splitMessage = messageContent.split("!")[1];
    if (messageContent.startsWith(config.prefix) && splitMessage) {
      const command = client.commandCollection.get(splitMessage.trim());
      command && command.execute(message, sock);
    }
  });
};

export default MessagesReponse;
