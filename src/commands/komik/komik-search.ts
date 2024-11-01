import ClientBot from "../../utility/ClientBot";
import { IResponse } from "../../utility/Types";
import { proto, WASocket } from "@whiskeysockets/baileys";
import { deletePrefixCommand } from "../../utility/Function";

const search = {
  name: "komik-search",
  description: "Komik search command",
  dmOnly: true,
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, client: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;
    const messageUser = deletePrefixCommand(message.message?.conversation?.toLowerCase() as string, this.name);

    if (!messageUser) return await sock.sendMessage(keyRemoteJid, { text: "Tolong masukan nama komik!" });

    try {
      const { data } = await client.instance.get<IResponse>(`/search?keyword=${messageUser}`);
      const dataResponse: IResponse = data;
      const dataKomik = dataResponse.data.slice(0, 5);

      if (!dataKomik.length) return await sock.sendMessage(keyRemoteJid, { text: "Komik not found!" });

      let messageResponse = `─────= *📚 Komik List 📚* =─────\n`;
      dataKomik.forEach((komik, index, array) => {
        messageResponse += `*${index + 1}.* ${komik.title}\n`;
        messageResponse += `- Type: ${komik.type}\n`;
        messageResponse += `- Chapter: ${komik.chapter}\n`;
        messageResponse += `- Rating: ${komik.rating}${index + 1 === array.length ? "" : "\n\n"}`;
      });

      return await sock.sendMessage(keyRemoteJid, { text: messageResponse });
    } catch (error) {
      console.error(error);
      return await sock.sendMessage(keyRemoteJid, { text: "Error" });
    }
  },
};

export default search;
