import config from "../config";

const deletePrefixCommand = (messageUser: string, commandName: string): string => {
  return messageUser.replace(`${config.prefix}${commandName}`, "").trim();
};

export { deletePrefixCommand };
