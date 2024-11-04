import fs from "fs";
import path from "path";
import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { proto, WASocket } from "@whiskeysockets/baileys";
import { deletePrefixCommand } from "../../utility/Function";

const listCommand: { [key: string]: string[] } = {
  example: ["hallo"],
  general: ["help"],
  komik: [
    "komik-list",
    "komik-regis",
    "komik-delete [nama komik]",
    "komik-search [nama komik]",
    "komik-subs [nama komik]",
    "komik-subscon",
    "komik-subscan",
  ],
};

const help = {
  name: "help",
  description: "Example help command",
  dmOnly: false,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const commandPath = path.join(__dirname, "../../commands");
    const commnadFolders = fs.readdirSync(commandPath);
    const messageUser = deletePrefixCommand(message.message?.conversation?.toLowerCase() as string, this.name);

    let messageResponse = `────= *📃 Commands List 📃* =────\n\n`;

    if (messageUser) {
      if (commnadFolders.includes(messageUser)) {
        messageResponse = `─────= *📃 ${messageUser.charAt(0).toUpperCase() + messageUser.slice(1)} List 📃* =─────\n\n`;
      } else {
        messageResponse = `────= *❌ Command Not Found ❌* =────\n\n`;
      }
      listCommand[messageUser].forEach((command) => {
        messageResponse += `- *${config.prefix}${command}*\n`;
      });
    } else {
      commnadFolders.forEach((category) => {
        messageResponse += `- *${config.prefix}help ${category}*\n`;
      });
    }

    return await sock.sendMessage(message.key.remoteJid as string, { text: messageResponse });
  },
};

export default help;
