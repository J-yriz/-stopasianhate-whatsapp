import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { prisma } from "../../utility/db/Prisma";
import { proto, WASocket } from "@whiskeysockets/baileys";

const register = {
  name: "komik-regis",
  description: "Register subscription komik",
  dmOnly: true,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;

    const userDataDB = await prisma.user.findMany({
      where: {
        number: keyRemoteJid,
      },
    });

    if (userDataDB.length) return;

    try {
      await prisma.user.create({
        data: {
          number: keyRemoteJid,
        },
      });

      return await sock.sendMessage(keyRemoteJid, {
        text: `*Success*\nKamu berhasil register. \n\nSilahkan menambahkan komik *${config.prefix}komik-search [nama komik]*`,
      });
    } catch (error) {
      console.log(error);
      return await sock.sendMessage(keyRemoteJid, { text: "Error" });
    }
  },
};

export default register;
