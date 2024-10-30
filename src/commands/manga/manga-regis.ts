import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { prisma } from "../../utility/db/Prisma";
import { proto, WASocket } from "@whiskeysockets/baileys";

const register = {
  name: "manga-regis",
  description: "Register subscription manga",
  dmOnly: true,
  maintenance: true,
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
        text: `*Success*\nKamu berhasil register. \n\nSilahkan menambahkan manga **${config.prefix}manga-search [nama manga]**`,
      });
    } catch (error) {
      console.log(error);
      return await sock.sendMessage(keyRemoteJid, { text: "Error" });
    }
  },
};

export default register;
