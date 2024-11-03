import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { prisma } from "../../utility/db/Prisma";
import { proto, WASocket } from "@whiskeysockets/baileys";

const confirm = {
  name: "komik-subscon",
  description: "Komik subscription confirm command",
  dmOnly: true,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;
    const komikData = clint.saveCmdRunKomik[keyRemoteJid];

    try {
      const [userDataDB] = await prisma.user.findMany({ where: { number: keyRemoteJid } });
      delete clint.saveCmdRunKomik[keyRemoteJid];

      if ((await prisma.subscription_komik.count({ where: { user_id: userDataDB.id } })) > 5) {
        return await sock.sendMessage(keyRemoteJid, { text: "Kamu sudah mencapai batas maksimal 5 subscription." });
      }

      await prisma.subscription_komik.create({
        data: {
          komik_name: komikData.title,
          total_chapter: komikData.chapterTotal,
          user: { connect: { id: userDataDB.id } },
        },
      });

      return await sock.sendMessage(keyRemoteJid, {
        text: `Sukses menambahkan subscription.\nKamu bisa melihat list mu dengan\n*${config.prefix}komik-list*\nJika ingin menghapus subscription gunakan\n*${config.prefix}komik-delete [nomer komik]*`,
      });
    } catch (error) {
      console.log(error);
      return await sock.sendMessage(keyRemoteJid, { text: "Error" });
    }
  },
};

export default confirm;
