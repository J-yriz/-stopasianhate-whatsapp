import cron from "node-cron";
import ClientBot from "../utility/ClientBot";
import { IDetailResponse } from "../utility/Types";
import { prisma } from "../utility/db/Prisma";
import { WASocket } from "@whiskeysockets/baileys";

const CronJob = (sock: WASocket, client: ClientBot) => {
  cron.schedule("0 6 * * *", async () => {
    const komikDataDB = await prisma.subscription_komik.findMany({ include: { user: true } });
    if (!komikDataDB.length) return;

    komikDataDB.forEach(async (dataKomik) => {
      try {
        const { data } = await client.instance.get<IDetailResponse>(`/detail/${dataKomik.komik_name.split(" ").join("-")}`);
        const dataKomikDetail = data.data;

        if (Number(dataKomik.total_chapter) === dataKomikDetail.chapter.length) return;

        await prisma.subscription_komik.update({
          data: { total_chapter: dataKomikDetail.chapter.length },
          where: { user_id: dataKomik.user.id, komik_name: dataKomik.komik_name },
        });

        let messageResponse: string = `─────= *📚 Update Komik 📚* =─────\n`;
        messageResponse += `*${dataKomik.komik_name}*\n`;
        messageResponse += `- Type: ${dataKomikDetail.type}\n`;
        messageResponse += `- Chapter: ${dataKomikDetail.chapter[0].title}\n\n`;
        messageResponse += `Link Komik: https://komikcast.cz${dataKomikDetail.chapter[0].href}`;

        return await sock.sendMessage(dataKomik.user.number, { text: messageResponse });
      } catch (error) {
        console.log(error);
        return await sock.sendMessage(dataKomik.user.number, { text: "Error" });
      }
    });
  });
};

export default CronJob;
