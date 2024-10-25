import ClientBot from "./utility/ClientBot";

const client = new ClientBot();
try {
  client.startBot();
} catch (error) {
  console.error(error);
}
