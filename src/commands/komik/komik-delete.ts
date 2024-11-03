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
    if (!userDataDB.length) {
      return sock.sendMessage(keyRemoteJid, { text: `Kamu belum terdaftar.\nSilahkan daftar dengan *${config.prefix}komik-regis*` });
    }

    const komikDataDB = await prisma.subscription_komik.findMany({ where: { user_id: userDataDB[0].id } });
    if (!komikDataDB.length) {
      return sock.sendMessage(keyRemoteJid, {
        text: `Kamu belum berlangganan komik.\nSilahkan berlangganan *${config.prefix}komik-subs [nama komik]*`,
      });
    }

    try {
      const deleteKomikDB = await prisma.subscription_komik.delete({
        where: { user_id: userDataDB[0].id, komik_name: { contains: messageUser } },
      });
      return sock.sendMessage(keyRemoteJid, { text: `Berhasil menghapus komik *${deleteKomikDB.komik_name}* dari daftar` });
    } catch (error) {
      console.log(error);
      return sock.sendMessage(keyRemoteJid, { text: `Terjadi kesalahan saat menghapus data komik.` });
    }
  },
};

export default response;
