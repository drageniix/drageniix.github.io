import colors from "colors/safe";

export default {
  info(message: string) {
    console.log(`[INFO] ${new Date().toLocaleString()} --- ${message}`);
  },
  error(message: string) {
    console.log(
      colors.red(`[ERROR] ${new Date().toLocaleString()} --- ${message}`)
    );
  }
};
