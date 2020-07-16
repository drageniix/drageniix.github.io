import colors from "colors/safe";

export default {
  info(message: string, traceId?: string): void {
    console.log(
      colors.cyan(
        `[INFO] ${new Date().toLocaleString()} --${traceId || ""}-- ${message}`
      )
    );
  },
  error(message: string, traceId?: string): void {
    console.log(
      colors.red(
        `[ERROR] ${new Date().toLocaleString()} --${traceId || ""}-- ${message}`
      )
    );
  },
};
