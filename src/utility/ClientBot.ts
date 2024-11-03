import fs from "fs";
import path from "path";
import axios, { AxiosInstance } from "axios";
import makeWASocket, { proto, useMultiFileAuthState, WASocket } from "@whiskeysockets/baileys";
import config from "../configDev";

interface ICommandCollection {
  name: string;
  description: string;
  dmOnly: boolean;
  maintenance: boolean;
  execute: (message: proto.IWebMessageInfo, sock: WASocket, client: ClientBot) => void;
}

class ClientBot {
  /*
   * Record untuk menyimpan command yang sedang berjalan sementara
   * seperti pada saat user melakukan konfirmasi command di kategori manga
   */
  public saveCmdRunKomik: Record<string, { commandName: string; title: string; chapterTotal: number }> = {};

  // Map untuk melakukan penyimpanan command
  public commandCollection: Map<string, ICommandCollection> = new Map();
  public instance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: config.baseURL,
  });

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
    (
      await Promise.all(
        fs
          .readdirSync(eventPath)
          .filter((file) => file.endsWith(".js"))
          .map((file) => import(`${eventPath}/${file}`))
      )
    ).forEach((event) => event.default(sock, this));
  }
}

export default ClientBot;
