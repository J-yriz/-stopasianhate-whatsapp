import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { prisma } from "../../utility/db/Prisma";
import { proto, WASocket } from "@whiskeysockets/baileys";

const list = {
  name: "komik-list",
  description: "Komik list command",
  dmOnly: true,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;
    const userDataDB = await prisma.user.findMany({ where: { number: keyRemoteJid } });
    if (!userDataDB.length)
      return await sock.sendMessage(keyRemoteJid, { text: `Kamu belum terdaftar.\nSilahkan daftar dengan *${config.prefix}komik-regis*` });

    console;
    const komikDataDB = await prisma.subscription_komik.findMany({ where: { user_id: userDataDB[0].id } });
    if (!komikDataDB.length)
      return await sock.sendMessage(keyRemoteJid, {
        text: `Kamu belum berlangganan komik.\nSilahkan berlangganan *${config.prefix}komik-subs [nama komik]*`,
      });

    let messageResponse: string = `─────= *📚 Komik List 📚* =─────\n`;
    komikDataDB.forEach((komik, index, array) => {
      messageResponse += `*${index + 1}.* ${komik.komik_name}`;
    });
    messageResponse += `\n\nUntuk menghapus berlangganan gunakan *${config.prefix}komik-delete [nama komik]*`;

    return await sock.sendMessage(keyRemoteJid, { text: messageResponse });
  },
};

export default list;
