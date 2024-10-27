import fs from "fs";
import path from "path";
import ClientBot from "../utility/ClientBot";
import { WASocket } from "@whiskeysockets/baileys";

const CommandHandler = async (sock: WASocket, client: ClientBot) => {
  // Path ke folder commands
  const commandPath = path.join(__dirname, "../commands");
  const commandFolders = fs.readdirSync(commandPath);

  // Looping setiap file command yang ada di dalam folder commands
  for (const commandFolder of commandFolders) {
    const commandFiles = fs.readdirSync(`${commandPath}/${commandFolder}`).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = await import(`${commandPath}/${commandFolder}/${file}`);
      // Menambahkan command ke dalam collection
      !command.default.maintenance && client.commandCollection.set(command.default.name, command.default);
    }
  }
};

export default CommandHandler;
