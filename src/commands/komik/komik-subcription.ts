import config from "../../configDev";
import ClientBot from "../../utility/ClientBot";
import { prisma } from "../../utility/db/Prisma";
import { IDetailResponse, IResponse } from "../../utility/Types";
import { proto, WASocket } from "@whiskeysockets/baileys";
import { deletePrefixCommand } from "../../utility/Function";

const subscription = {
  name: "komik-subs",
  description: "komik subscription command",
  dmOnly: true,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, clint: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;
    const messageUser = deletePrefixCommand(message.message?.conversation?.toLowerCase() as string, this.name);

    if (!messageUser)
      return await sock.sendMessage(keyRemoteJid, {
        text: `Masukan nama komik!\n\nKamu bisa command untuk mencari komik.\n*${config.prefix}komik-search [nama komik]*`,
      });

    const userDataDB = await prisma.user.findMany({ where: { number: keyRemoteJid } });
    if (!userDataDB.length) return await sock.sendMessage(keyRemoteJid, { text: `Silahkan regis terlbeih dahulu!\n*${config.prefix}komik-regis*` });

    try {
      const response = await clint.instance.get<IResponse>(`/search?keyword=${messageUser}`);
      const dataResponse: IResponse = response.data;
      const dataKomik = dataResponse.data.slice(0, 1);

      if (!dataKomik.length) return await sock.sendMessage(keyRemoteJid, { text: "Komik not found!" });

      const responseDetail = await clint.instance.get<IDetailResponse>(`/detail/${dataKomik[0].title.split(" ").join("-")}`);

      let messageResponse: string = `─────= *📚 Confirm Komik 📚* =─────\n`;
      messageResponse += `*${dataKomik[0].title}*\n`;
      messageResponse += `- Type: ${dataKomik[0].type}\n`;
      messageResponse += `- Total Chapter: ${responseDetail.data.data.chapter.length}\n`;
      messageResponse += `- Status: ${responseDetail.data.data.status}\n`;
      messageResponse += `- Rating: ${dataKomik[0].rating}\n\n`;
      messageResponse += `Jika benar silahkan ketik \n*${config.prefix}komik-subscon*\ndan jika salah silahkan ketik \n*${config.prefix}komik-subscan*`;

      clint.saveCmdRunKomik[keyRemoteJid] = {
        commandName: this.name,
        title: dataKomik[0].title,
        chapterTotal: responseDetail.data.data.chapter.length,
      };

      const imageMessage = await sock.sendMessage(keyRemoteJid, { image: { url: dataKomik[0].thumbnail.replace("w=400", "w=1000") } });
      return await sock.sendMessage(keyRemoteJid, { text: messageResponse }, { quoted: imageMessage });
    } catch (error) {
      console.log(error);
      return await sock.sendMessage(keyRemoteJid, { text: "Error" });
    }
  },
};

export default subscription;
