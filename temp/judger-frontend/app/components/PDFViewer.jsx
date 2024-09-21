import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import useDebounce from '@/hooks/useDebounce'; // Assuming useDebounce is defined here

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ pdfFileURL }) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.75);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Debounced window width
  const debouncedWindowWidth = useDebounce(windowWidth, 100);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    // Add event listener to handle window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const width = debouncedWindowWidth;
    const maxScale = 1.75;
    const minScale = 0.75;
    const maxWidth = 1200;
    const minWidth = 400;

    if (width <= minWidth) {
      setScale(minScale);
    } else if (width >= maxWidth) {
      setScale(maxScale);
    } else {
      // Linear interpolation between minScale and maxScale
      const scaleValue =
        ((width - minWidth) / (maxWidth - minWidth)) * (maxScale - minScale) +
        minScale;
      setScale(scaleValue);
    }
  }, [debouncedWindowWidth]);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <Document file={pdfFileURL} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from({ length: numPages }, (_, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          scale={scale}
        />
      ))}
    </Document>
  );
}
