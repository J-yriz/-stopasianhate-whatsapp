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
    if (messageContent.startsWith(config.prefix) && !splitMessage.includes(" ")) {
      const command = client.commandCollection.get(splitMessage);
      const numberUser = ("0" + message.key.remoteJid?.split("@")[0].slice(2)) as string;

      if (!command) return;

      if (command.maintenance) {
        if (!config.dev.includes(numberUser)) {
          return await sock.sendMessage(message.key.remoteJid as string, { text: "Command ini sedang dalam perbaikan!" });
        }
      }
      
      return await command.execute(message, sock);
    }
  });
};

export default MessagesReponse;
