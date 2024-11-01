import config from "../configDev";
import ClientBot from "../utility/ClientBot";
import { WASocket } from "@whiskeysockets/baileys";

const MessagesReponse = (sock: WASocket, client: ClientBot) => {
  sock.ev.on("messages.upsert", async (msg) => {
    const message = msg.messages[0];
    if (message.key.fromMe || !message.message) return;

    const messageContent = (message.message.conversation || "").toLowerCase();
    if (!messageContent || !messageContent.startsWith(config.prefix) || messageContent.startsWith(`${config.prefix} `)) return;

    const keyRemoteJid = message.key.remoteJid as string;
    const splitMessage = messageContent.split("!")[1].trim().split(" ")[0];
    const command = client.commandCollection.get(splitMessage);
    const numberUser = ("0" + keyRemoteJid.split("@")[0].slice(2)) as string;

    if (!command) return;

    const listContinueCmd = ["komik-subscon", "komik-subscan"];
    const interactionCmd = client.saveCmdRunKomik[keyRemoteJid];

    if (interactionCmd && !listContinueCmd.includes(splitMessage)) {
      return await sock.sendMessage(keyRemoteJid, { text: `Kamu masih melakukan interaksi command ${interactionCmd.commandName}` });
    } else if (!interactionCmd && listContinueCmd.includes(splitMessage)) {
      return await sock.sendMessage(keyRemoteJid, {
        text: `Kamu tidak ada interaksi sebelumnya\nGunakan *${config.prefix}komik-subs [nama komik]* untuk memulai interaksi`,
      });
    }

    if (command.dmOnly && keyRemoteJid.includes("@g.us")) {
      return await sock.sendMessage(keyRemoteJid, { text: "Command ini hanya bisa digunakan di private chat!" });
    }

    if (command.maintenance) {
      const isGroup = keyRemoteJid.includes("@g.us");
      const isDevGroup = config.devGrup.includes(keyRemoteJid.replace("@g.us", ""));
      const isDevUser = config.devUser.includes(numberUser);

      if ((isGroup && !isDevGroup) || (!isGroup && !isDevUser)) {
        return await sock.sendMessage(keyRemoteJid, { text: "Command ini sedang dalam perbaikan!" });
      }
    }

    return await command.execute(message, sock, client);
  });
};

export default MessagesReponse;
