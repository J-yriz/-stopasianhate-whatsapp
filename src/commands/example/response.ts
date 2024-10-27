import { proto, WASocket } from "@whiskeysockets/baileys";

const response = { 
  name: "hallo",
  description: "Example response command",
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket) {
    return await sock.sendMessage(message.key.remoteJid as string, { text: "Halo juga!" });
  },
};

export default response;