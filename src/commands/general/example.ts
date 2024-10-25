import { proto, WASocket } from "@whiskeysockets/baileys";

const example = {
  name: "hallo",
  description: "Example command",
  async execute(message: proto.IWebMessageInfo, sock: WASocket) {
    await sock.sendMessage(message.key.remoteJid as string, { text: "Halo juga!" });
  },
};

export default example;