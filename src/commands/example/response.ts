import ClientBot from "../../utility/ClientBot";
import { proto, WASocket } from "@whiskeysockets/baileys";

const response = {
  name: "hallo",
  description: "Example response command",
  dmOnly: false,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;
    return await sock.sendMessage(keyRemoteJid, { text: "Halo juga!" });
  },
};

export default response;
