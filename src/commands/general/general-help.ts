import fs from "fs";
import path from "path";
import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { proto, WASocket } from "@whiskeysockets/baileys";
import { deletePrefixCommand } from "../../utility/Function";

const listCommand: { [key: string]: string[] } = {
  example: ["hallo"],
  general: ["help"],
  manga: ["manga-regis", "manga-search"],
};

const help = {
  name: "help",
  description: "Example help command",
  dmOnly: false,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const commandPath = path.join(__dirname, "../commands");
    const commnadFolders = fs.readdirSync(commandPath);
    const messageUser = deletePrefixCommand(message.message?.conversation?.toLowerCase() as string, this.name);

    let messageResponse: string = "";

    if (!messageUser) {
      messageResponse = `────= *📃 Commands List 📃* =────\n`;
      commnadFolders.forEach((category, index, array) => {
        messageResponse += `- *${config.prefix}${category}*\n`;
      });
    } else if (commnadFolders.includes(messageUser)) {
      messageResponse = `────= *📃 ${messageUser.charAt(0).toUpperCase() + messageUser.slice(1)} List 📃* =────\n`;
      listCommand[messageUser].forEach((command, index, array) => {
        messageResponse += `- *${config.prefix}${command}*\n`;
      });
    }

    return await sock.sendMessage(message.key.remoteJid as string, { text: messageResponse });
  },
};

export default help;
