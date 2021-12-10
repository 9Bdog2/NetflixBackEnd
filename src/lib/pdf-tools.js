import PdfPrinter from "pdfmake";

export const getPDFReadebleStream = (media) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      /* {
        image: `${media.author.avatar} `,
        fit: [100, 100],
      }, */
      {
        text: `${media.Title} \n\n`,
        style: "header",
      },
      `Year : ${media.Year} \n\n`,

      `Type : ${media.Type}\n\n`,
      {
        text: `Reviews \n\n`,
      },
      {
        text: media.Reviews.map(function (Reviews) {
          return {
            text:
              Reviews._id +
              "\n\n" +
              Reviews.comment +
              "\n\n" +
              Reviews.rate +
              "\n\n",
            pageBreak: "after",
          };
        }),
      },
      {
        text: `Timestamp : ${media.createdAt}\n\n`,
        style: ["quote", "small"],
      },
      {
        text: `Timestamp : ${media.updatedAt}\n\n`,
        style: ["quote", "small"],
      },
      { qr: `${media.Poster}` },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      small: {
        fontSize: 8,
      },
    },
    defaultStyle: {
      font: "Helvetica",
    },
  };

  const option = {
    filename: "myfile.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, logging: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, option);
  pdfReadableStream.end();
  return pdfReadableStream;
};
