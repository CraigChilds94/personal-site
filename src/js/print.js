// Buttons marked [data-print] open the browser's print dialog, which also offers Save as PDF.
// data-print-title sets the document title for the print, which browsers use as the PDF filename.
export default function initPrint() {
  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => {
      const originalTitle = document.title;
      if (button.dataset.printTitle) {
        document.title = button.dataset.printTitle;
        window.addEventListener("afterprint", () => {
          document.title = originalTitle;
        }, {once: true});
      }
      window.print();
    });
  });
}
