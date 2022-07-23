import FS from "fs";

const logHandler = FS.createWriteStream("./log.txt");
export default {
  clear() {
    if (FS.existsSync("./log.txt")) {
      FS.writeFileSync("./log.txt", "");
    }
  },
  write(data: string) {
    logHandler.write(`\n${data}`);
  }
}