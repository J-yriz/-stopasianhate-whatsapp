import { proto, WASocket } from "@whiskeysockets/baileys";

const button = {
  name: "button",
  description: "Example button command",
  maintenance: false,
  async execute(message: proto.IWebMessageInfo, sock: WASocket) {
    const buttons = [
      { displayText: "Tombol", id: "id", index: 0 },
      { displayText: "Tombol 1", id: "id1", index: 0 },
      { displayText: "Tombol 2", id: "id2", index: 0 },
    ];

    const buttonMessage = {
      text: "Pilih salah satu tombol di bawah:",
      footer: "Pilih dengan bijak!",
      buttons: buttons,
      headerType: 1,
    };

    try {
      await sock.sendMessage(message.key.remoteJid as string, buttonMessage);
      console.log("Pesan tombol berhasil dikirim");
    } catch (error) {
      console.error("Gagal mengirim pesan tombol:", error);
    }
  },
};

export default button;
