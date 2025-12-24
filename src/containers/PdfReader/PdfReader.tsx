import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  url: string | ArrayBuffer;
  pdfPageNumber: number;
  onPdfDocumentLoadSuccess: ({ numPages }: { numPages: number })=> void;
  height?: number;
  scale: number;
};

const PdfReader = ({
  url, pdfPageNumber, onPdfDocumentLoadSuccess, height, scale,
}: Props) => {
  return (
    <Document file={url} onLoadSuccess={onPdfDocumentLoadSuccess} loading="">
      <Page
        pageNumber={pdfPageNumber}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        height={height}
        scale={scale}
      />
    </Document>
  );
};

export default PdfReader;
