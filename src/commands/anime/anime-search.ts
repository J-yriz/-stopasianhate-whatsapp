import axios from "axios";
import { proto, WASocket } from "@whiskeysockets/baileys";

interface IDataResponse {
  title: string;
  image: string;
  endpoint: string;
}

interface IResponse {
  success: boolean;
  data: IDataResponse[];
}

const search = {
  name: "api",
  description: "Example api response command",
  maintenance: true,
  async execute(message: proto.IWebMessageInfo, sock: WASocket) {
    try {
      const { data } = await axios.get("https://komiku-api.fly.dev/api/comic/list");
      const dataResponse: IResponse = data;
      dataResponse.data.forEach((data) => {});

      return await sock.sendMessage(message.key.remoteJid as string, { text: "Response" });
    } catch (error) {
      console.error(error);
      return await sock.sendMessage(message.key.remoteJid as string, { text: "Error" });
    }
  },
};

export default search;
