import ClientBot from "../../utility/ClientBot";
import { proto, WASocket } from "@whiskeysockets/baileys";

const cancel = {
  name: "komik-subscan",
  description: "Komik subscription cancel command",
  dmOnly: true,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;

    try {
      delete clint.saveCmdRunKomik[keyRemoteJid];
      return await sock.sendMessage(keyRemoteJid, { text: `Sukses membatalkan subscription.` });
    } catch (error) {
      console.log(error);
      return await sock.sendMessage(keyRemoteJid, { text: "Error" });
    }
  },
};

export default cancel;
