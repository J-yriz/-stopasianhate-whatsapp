import fs from "fs";
import path from "path";
import makeWASocket, { proto, useMultiFileAuthState, WASocket } from "@whiskeysockets/baileys";

interface ICommandCollection {
  name: string;
  description: string;
  maintenance: boolean;
  execute: (message: proto.IWebMessageInfo, sock: WASocket) => void;
}

class ClientBot {
  public commandCollection: Map<string, ICommandCollection> = new Map();

  async startBot() {
    // Path ke folder events
    const eventPath = path.join(__dirname, "../events");

    // Fungsi useMultiFileAuthState digunakan untuk membuat state folder yang bisa disimpan ke dalam file
    const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
    const sock = makeWASocket({
      browser: ["Windows", "Chrome", "11"],
      auth: state,
      printQRInTerminal: false,
    });

    // Simpan kredensial setiap kali ada perubahan
    sock.ev.on("creds.update", saveCreds);
    (await Promise.all(fs.readdirSync(eventPath).map((file) => import(`${eventPath}/${file}`)))).forEach((event) => event.default(sock, this));
  }
}

export default ClientBot;
