import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar";
import { View } from "tns-core-modules/ui/page/page";

// Create an instance of SnackBar
let snackbar = new SnackBar();

function notify(msg, type) {
  return snackbar.simple(msg, '#fff', type, 3).then(() => {
    console.log(`Snackbar resolved`);
  });
}

export default notify;
