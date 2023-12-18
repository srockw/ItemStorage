import { items } from "./storage";

const confirmClearMessage = "I am aware that this is irreversible and I wish to do it";

export const maxPagesArgumentType = Commands.custom({
  parse(reader) {
    const int = reader.readInt();
    const maxPages = Math.ceil(items.size / 45);

    if (int < 1 || int > maxPages)
      Commands.error(reader, `Page should be between 1 and ${maxPages}`);

    return int;
  },
});

export const clearArgumentType = Commands.custom({
  parse(reader) {
    let string = "";

    while (reader.canRead()) {
      string += String.fromCharCode(reader.read());
    }

    if (string.toLowerCase() != confirmClearMessage.toLowerCase()) {
      Commands.error(reader, `Please type: '${confirmClearMessage}' to confirm`);
    }

    return string;
  },
});
