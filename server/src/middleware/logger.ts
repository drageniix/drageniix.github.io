import colors from "colors/safe";

export default {
  info(message: string, traceId?: string) {
    console.log(
      `[INFO] ${new Date().toLocaleString()} --${traceId || ""}-- ${message}`
    );
  },
  error(message: string, traceId?: string) {
    console.log(
      colors.red(
        `[ERROR] ${new Date().toLocaleString()} --${traceId || ""}-- ${message}`
      )
    );
  },
};
