import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { prisma } from "../../utility/db/Prisma";
import { proto, WASocket } from "@whiskeysockets/baileys";
import { deletePrefixCommand } from "../../utility/Function";

const response = {
  name: "komik-delete",
  description: "Komik delete command",
  dmOnly: true,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;
    const messageUser = deletePrefixCommand(message.message?.conversation?.toLowerCase() as string, this.name);

    const userDataDB = await prisma.user.findMany({ where: { number: keyRemoteJid } });
    if (!userDataDB.length)
      return await sock.sendMessage(keyRemoteJid, { text: `Kamu belum terdaftar.\nSilahkan daftar dengan *${config.prefix}komik-regis*` });

    try {
      const deleteKomikDB = await prisma.subscription_komik.delete({
        where: {
          id: userDataDB[0].id,
          komik_name: {
            contains: messageUser,
          },
        },
      });

      if (!deleteKomikDB)
        return await sock.sendMessage(keyRemoteJid, { text: `Komik *${messageUser}* tidak ditemukan.\nSilahkan list *${config.prefix}komik-list*` });

      return await sock.sendMessage(keyRemoteJid, { text: `Berhasil menghapus komik *${messageUser}* dari daftar` });
    } catch (error) {
      console.log(error);
      return await sock.sendMessage(keyRemoteJid, { text: `Terjadi kesalahan saat menghapus data komik.` });
    }
  },
};

export default response;
