import { useState, useEffect, useRef } from 'react'
import ErrorMessage from './components/commons/ErrorMessage/ErrorMessage';
import Reader from './containers/Reader/Reader';
import styles from './containers/Reader/Reader.module.scss';
import book from './assets/bookExamples/example.epub'


// TODO: заменить на реальные данные
const BOOK_TITLE = 'Название книги';
const BOOK_AUTHOR = 'Автор книги';
const BOOK_URL = "";
const COVER_URL = 'https://card-content.yotoplay.com/yoto/pub/19c7YnR3W_THnnAH2vzjxEqFytwqHscWtApXD7sZ_p4';
const ID = '';


function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  // TODO: downloadProgress сразу поставила 100%
  const [downloadProgress, setDownloadProgress] = useState(100);
  const [error, setError] = useState<string | null>(null);

  // TODO: тут загрузка книги, для наглядности пока добавила заглушку из локального файла, надо раскомментировать useEffect

  // useEffect(() => {
  //   let xhr: XMLHttpRequest | null = null;
  //   let cancelled = false;

  //   const loadBook = async () => {
  //     try {
  //       const metaRes = await fetch(BOOK_URL, {
  //         credentials: 'include',
  //       });
  //       const { url: fileUrl } = await metaRes.json();

  //       if (!fileUrl) {
  //         throw new Error('fileUrl отсутствует в ответе');
  //       }

  //       xhr = new XMLHttpRequest();
  //       xhr.open('GET', fileUrl);
  //       xhr.responseType = 'arraybuffer';

  //       setDownloadProgress(0);
  //       setArrayBuffer(null);
  //       setError(null);

  //       xhr.onprogress = (e) => {
  //         if (e.lengthComputable) {
  //           const pct = Math.round((e.loaded / e.total) * 100);
  //           setDownloadProgress(pct);
  //         } else {
  //           setDownloadProgress((prev) => (prev < 90 ? prev + 1 : prev));
  //         }
  //       };

  //       xhr.onload = () => {
  //         if (cancelled) return;

  //         if (xhr!.status >= 200 && xhr!.status < 300) {
  //           setArrayBuffer(xhr!.response);
  //           setDownloadProgress(100);
  //         } else {
  //           setError(`Ошибка загрузки файла: ${xhr!.status}`);
  //         }
  //       };

  //       xhr.onerror = () => {
  //         if (cancelled) return;
  //         setError('Сетевая ошибка при загрузке файла');
  //       };

  //       xhr.send();
  //     } catch (err: any) {
  //       if (!cancelled) {
  //         console.error('Ошибка загрузки книги:', err);
  //         setError('Ошибка загрузки книги');
  //       }
  //     }
  //   };

  //   loadBook();

  //   return () => {
  //     cancelled = true;
  //     if (xhr) xhr.abort();
  //   };
  // }, [BOOK_URL]);

  return (
    <div className={styles.commonContainer} ref={containerRef}>
      {error && <ErrorMessage message={error} />}
        <Reader
        // TODO: раскомментировать строку ниже и убрать url={book}
          // url={arrayBuffer}
          url={book}
          id={ID}
          bookTitle={BOOK_TITLE}
          bookAuthor={BOOK_AUTHOR}
          coverUrl={COVER_URL}
          downloadProgress={downloadProgress}
        />
    </div>
  );
}

export default App
