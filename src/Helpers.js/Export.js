export function downloadFile(filename, url) {
  let link = document.createElement("a");
  link.setAttribute("download", filename);
  link.setAttribute("href", url);
  link.click();
}

export function downloadTextASFile(filename, text) {
  downloadFile(
    filename,
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
}
