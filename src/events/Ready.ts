import { isBoom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import ClientBot from "../utility/ClientBot";
import { WASocket, DisconnectReason } from "@whiskeysockets/baileys";

// Tangani event ready saat bot terhubung ke WhatsApp
const Ready = (sock: WASocket, client: ClientBot) => {
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (connection === "close") {
      if (lastDisconnect?.error && isBoom(lastDisconnect.error)) {
        const error = lastDisconnect.error;
        // Jika error bukan karena logout, maka bot akan mencoba untuk terhubung kembali
        if (error.output.statusCode !== DisconnectReason.loggedOut) {
          client.startBot();
        }
      }
    } else if (connection === "open") {
      console.log("Terhubung ke WhatsApp");
    }
    // Melakukan generate QR code jika bot belum terhubung ke WhatsApp
    qr &&
      qrcode.generate(qr, { small: true }, (qrcode) => {
        console.log(qrcode);
      });
  });
};

export default Ready;
