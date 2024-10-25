import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { isBoom } from "@hapi/boom";
import qrcode from "qrcode-terminal";

// Fungsi utama untuk membuat koneksi
async function connectToWhatsApp() {
  // Menggunakan useMultiFileAuthState untuk menyimpan session di folder 'auth_info'
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // Menampilkan QR di terminal untuk login
  });

  // Simpan kredensial setiap kali ada perubahan
  sock.ev.on("creds.update", saveCreds);

  // Tangani pesan masuk
  sock.ev.on("messages.upsert", async (msg) => {
    const message = msg.messages[0];

    // Pastikan pesan tidak dari grup dan dari user biasa
    if (!message.key.fromMe && message.message) {
      const messageContent = message.message.conversation || "";

      if (messageContent.toLowerCase() === "hallo") {
        await sock.sendMessage(message.key.remoteJid as string, { text: "Halo juga!" });
      }
    }
  });

  // Tangani koneksi yang terputus
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (connection === "close") {
      if (lastDisconnect?.error && isBoom(lastDisconnect.error)) {
        const error = lastDisconnect.error;
        if (error.output.statusCode !== DisconnectReason.loggedOut) {
          // Reconnect jika belum logout
          connectToWhatsApp();
        }
      }
    } else if (connection === "open") {
      console.log("Terhubung ke WhatsApp");
    }
    qr &&
      qrcode.generate(qr, { small: true }, (qrcode) => {
        console.log(qrcode);
      });
  });
}

// Jalankan koneksi
connectToWhatsApp();
