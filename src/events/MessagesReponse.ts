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
    if (messageContent.startsWith(config.prefix) && !messageContent.startsWith(`${config.prefix} `)) {
      const messageId = message.key.remoteJid as string;
      const splitMessage = messageContent.split("!")[1].trim().split(" ")[0];
      const command = client.commandCollection.get(splitMessage);
      const numberUser = ("0" + messageId.split("@")[0].slice(2)) as string;

      if (!command) return;

      if (command.maintenance) {
        if (messageId.includes("@g.us") && !config.devGrup.includes(messageId.replace("@g.us", ""))) {
          return await sock.sendMessage(messageId, { text: "Command ini sedang dalam perbaikan!" });
        } else if (!messageId.includes("@g.us") && !config.devUser.includes(numberUser)) {
          return await sock.sendMessage(messageId, { text: "Command ini sedang dalam perbaikan!" });
        }
      }

      return await command.execute(message, sock, client);
    }
  });
};

export default MessagesReponse;
