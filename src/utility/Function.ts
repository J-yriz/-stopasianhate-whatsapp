import config from "../configDev";

const deletePrefixCommand = (messageUser: string, commandName: string): string => {
  return messageUser.replace(`${config.prefix}${commandName}`, "").trim();
};

export { deletePrefixCommand };
