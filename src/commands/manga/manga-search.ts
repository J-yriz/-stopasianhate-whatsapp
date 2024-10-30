import ClientBot from "../../utility/ClientBot";
import { proto, WASocket } from "@whiskeysockets/baileys";
import { deletePrefixCommand } from "../../utility/Function";

interface IDataResponse {
  title: string;
  type: string;
  chapter: string;
  rating: string;
  href: string;
  thumnail: string;
}

interface IResponse {
  success: boolean;
  data: IDataResponse[];
}

const search = {
  name: "manga-search",
  description: "Manga search command",
  maintenance: true,
  async execute(message: proto.IWebMessageInfo, sock: WASocket, client: ClientBot) {
    const keyRemoteJid = message.key.remoteJid as string;
    const messageUser = deletePrefixCommand(message.message?.conversation?.toLowerCase() as string, this.name);

    if (!messageUser) return await sock.sendMessage(keyRemoteJid, { text: "Please input manga name!" });

    try {
      const { data } = await client.instance.get<IResponse>(`/search?keyword=${messageUser}`);
      const dataResponse: IResponse = data;
      const dataManga = dataResponse.data.slice(0, 5);

      if (!dataManga.length) return await sock.sendMessage(keyRemoteJid, { text: "Manga not found!" });

      let messageResponse = `─────= *📚 Manga List 📚* =─────\n`;
      dataManga.forEach((manga, index, array) => {
        messageResponse += `*${index + 1}.* ${manga.title}\n`;
        messageResponse += `- Type: ${manga.type}\n`;
        messageResponse += `- Chapter: ${manga.chapter}\n`;
        messageResponse += `- Rating: ${manga.rating}${index + 1 === array.length ? "" : "\n\n"}`;
      });

      return await sock.sendMessage(keyRemoteJid, { text: messageResponse });
    } catch (error) {
      console.error(error);
      return await sock.sendMessage(keyRemoteJid, { text: "Error" });
    }
  },
};

export default search;
