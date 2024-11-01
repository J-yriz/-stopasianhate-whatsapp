import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { prisma } from "../../utility/db/Prisma";
import { proto, WASocket } from "@whiskeysockets/baileys";

const response = {
  name: "komik-delete",
  description: "Komik delete command",
  dmOnly: true,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;
    const userDataDB = await prisma.user.findMany({ where: { number: keyRemoteJid } });
    if (!userDataDB.length)
      return await sock.sendMessage(keyRemoteJid, { text: `Kamu belum terdaftar.\nSilahkan daftar dengan *${config.prefix}komik-regis*` });

    

    return await sock.sendMessage(keyRemoteJid, { text: "Halo juga!" });
  },
};

export default response;
