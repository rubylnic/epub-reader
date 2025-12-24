import { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { EpubView } from 'react-reader';
import { NavItem, Rendition } from 'epubjs';
import { BookStyle, BookOption } from 'types/book';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Nav from '../Nav/Nav';
import Option from '../Option/Option';
import styles from './Reader.module.scss';
import { ArrowRightIcon } from '../../assets/images/ArrowRightIcon';
import { ArrowIcon } from '../../assets/images/ArrowIcon';
import LoadingComponent from '../../components/commons/LoadingComponent/LoadingComponent';
import Wrapper from '../Wrapper/Wrapper';
import useElementHeight from '../../hooks/useElementHeight';
import PdfReader from '../PdfReader/PdfReader';

type Props = {
  url: string | ArrayBuffer | null;
  id: string;
  bookTitle: string;
  bookAuthor: string;
  bookFormat: string;
  coverUrl: string | null;
  downloadProgress: number;
};

const initBookStyle = {
  fontSize: 18,
  lineHeight: 1.4,
  marginHorizontal: 15,
  marginVertical: 15,
};

const initBookOption = {
  flow: 'paginated',
  resizeOnOrientationChange: true,
  spread: 'always',
};

const MAX_PDF_HEIGHT = 760;

const Reader = ({
  url, id, bookTitle, bookAuthor, coverUrl, downloadProgress, bookFormat,
}: Props) => {
  const { pathname } = window.location;
  const bookId = pathname.split('/').pop();
  const savedBookInfo = localStorage.getItem(`book_${bookId}`);
  const parsedBookInfo = savedBookInfo ? JSON.parse(savedBookInfo) : null;

  const isEpub = bookFormat === 'epub';
  const isAvailableBookFormat = bookFormat === 'epub' || bookFormat === 'pdf';

  const [scale, setScale] = useState(1);
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const [containerRef, containerHeight] = useElementHeight<HTMLDivElement>(isEpub);
  const footerHeight = window.matchMedia('(max-width: 992px)').matches ? 150 : 80;
  const pdfHeight = containerHeight ? Math.min(containerHeight - footerHeight, MAX_PDF_HEIGHT) : MAX_PDF_HEIGHT;

  const [currentLocation, setCurrentLocation] = useState({
    currentPage: 0, totalPage: 0, chapterIndex: 0, atStart: false, atEnd: false,
  });


  const renditionRef = useRef<Rendition | undefined>(undefined);
  const isInitialLocationRef = useRef(true);
  const toc = useRef<NavItem[]>([]);
  const totalPagesRef = useRef(0);
  const readerRef = useRef<EpubView | null>(null);

  const [location, setLocation] = useState(parsedBookInfo?.location || 0);
  const [percent, setPercent] = useState(parsedBookInfo?.percent || 0);
  const [bookStyle, setBookStyle] = useState<BookStyle>(parsedBookInfo?.bookStyle || initBookStyle);
  const [bookOption, setBookOption] = useState<BookOption>(parsedBookInfo?.bookOption || initBookOption);
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);

  const onBookStyleChange = (bookStyle_: BookStyle) => setBookStyle(bookStyle_);
  const onBookOptionChange = (bookOption_: BookOption) => setBookOption(bookOption_);

  const onWrapperToggle = (type: 'nav' | 'option') => {
    setCurrentMenu((prev) => {
      if (prev === type) {
        return null;
      }
      return type;
    });
  };

  const onCloseWrapper = () => {
    setCurrentMenu(null);
  };

  const onPageMove = (type: 'PREV' | 'NEXT') => {
    if (type === 'PREV') {
      if (isEpub && readerRef.current) {
        renditionRef.current?.prev();
      } else {
        setCurrentLocation((prev) => ({
          ...prev,
          currentPage: prev.currentPage > 1 ? prev.currentPage - 1 : 1,
        }));
      }
    }

    if (type === 'NEXT') {
      if (isEpub && readerRef.current) {
        renditionRef.current?.next();
      } else {
        setCurrentLocation((prev) => ({
          ...prev,
          currentPage: prev.currentPage < prev.totalPage ? prev.currentPage + 1 : prev.currentPage,
        }));
      }
    }
  };

  const updateLocation = (rendition: Rendition) => {
    const atEnd = rendition.location?.atEnd;
    const atStart = rendition.location?.atStart;
    const currentPage = rendition.location?.start.displayed.page;
    const totalPage = rendition.location?.start.displayed.total;
    const chapterIndex = rendition.location?.start.index;
    setCurrentLocation({
      currentPage, totalPage, atStart, atEnd, chapterIndex,
    });
  };

  const setLSBookInfo = (loc: string, percentLoc: number) => {
    localStorage.setItem(`book_${bookId}`, JSON.stringify({
      location: loc || location,
      ...(percentLoc ? { percent: percentLoc } : {}),
      bookStyle,
      bookOption,
    }));
  };

  const applyBookStyle = (rendition: Rendition, style: BookStyle) => {
    rendition.themes.select('custom');

    rendition.themes.override('font-size', `${style.fontSize}px`);
    rendition.themes.override('line-height', String(style.lineHeight));
  };

  const applyBookOption = (rendition: Rendition, option: BookOption) => {
    rendition.flow(option.flow);
    rendition.spread(option.spread);
    rendition.settings.resizeOnOrientationChange = option.resizeOnOrientationChange;
    setLSBookInfo(location, percent);
  };

  useEffect(() => {
    const body = document.querySelector('body');
    body?.classList.add('noPadding');
  }, []);

  const getRendition = async (_rendition: Rendition) => {
    if (!_rendition) return;
    renditionRef.current = _rendition;
    const { book } = _rendition;

    await book.ready;

    _rendition.themes.register('custom', { body: {} });
    _rendition.themes.select('custom');
    applyBookStyle(_rendition, bookStyle);
    applyBookOption(_rendition, bookOption);

    _rendition.hooks.content.register((contents: any) => {
      const doc = contents.document;
      const images = doc.querySelectorAll('svg');
      if (images.length !== 1) return;

      const node = images[0];
      node.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    });

    await book.locations.generate(1500);
    totalPagesRef.current = book.locations.length();

    if (percent) {
      const location = book.locations.cfiFromPercentage(percent);
      // @ts-ignore
      await _rendition.display(location);
    } else {
      await _rendition.display();
    }

    updateLocation(renditionRef.current);
    isInitialLocationRef.current = true;
  };

  useEffect(() => {
    if (readerRef.current?.rendition) {
      applyBookStyle(readerRef.current.rendition, bookStyle);
    }
    setLSBookInfo(location, percent);
  }, [bookStyle]);

  useEffect(() => {
    if (readerRef.current?.rendition) {
      applyBookOption(readerRef.current.rendition, bookOption);
    }
    setLSBookInfo(location, percent);
  }, [bookOption]);

  const onLocationChanged = (loc: string) => {
    if (isInitialLocationRef.current) {
      isInitialLocationRef.current = false;
    }
    setLocation(loc);
    if (renditionRef.current) {
      updateLocation(renditionRef.current);
      const { book } = renditionRef.current;
      const percent = book.locations.percentageFromCfi(loc);
      setPercent(percent);
      setLSBookInfo(loc, percent);
    }
  };

  const goToChapter = (href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href);
    }
  };

  const goToPage = (index: number) => {
    setCurrentLocation((prev) => ({
      ...prev,
      currentPage: index,
    }));
  };

  const onPdfDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setCurrentLocation((prev) => ({
      ...prev,
      currentPage: 1,
      totalPage: numPages,
    }));
  };

  const removeNotAvailableTocs = (_toc: NavItem[]) => {
    toc.current = _toc.filter((item) => {
      const label = item.label.toLowerCase();
      const excludeWords = ['note', 'footnote', 'примечани', 'сноск', 'оглавлен', 'содержан'];
      return !excludeWords.some((word) => label.includes(word));
    });
  };

  return (
    <>
      <div
        className={cn(
          styles.reader,
          {
            [styles['reader--scrolled']]: bookOption.flow === 'scrolled',
            [styles['reader--centered']]: bookOption.spread === 'none',
            [styles['reader--visible']]: downloadProgress > 0,
          },
        )}
      >
        <Header
          onMenuToggle={onWrapperToggle}
          bookTitle={bookTitle}
          bookAuthor={bookAuthor}
          id={id}
          isEpub={isEpub}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          currentMenu={currentMenu}
        />
        {url ? (
          <div
            className={styles.container}
            // @ts-ignore
            ref={containerRef}
          >
            <div className={styles.readerContainer}>
              <button
                type="button"
                className={cn(styles.button, styles.buttonPrev)}
                onClick={() => onPageMove('PREV')}
                aria-label="Предыдущая страница"
              />
              <button
                type="button"
                className={cn(styles.arrowButton, styles.arrowButtonPrev)}
                onClick={() => onPageMove('PREV')}
                disabled={isEpub ? currentLocation.atStart : currentLocation.currentPage === 1}
              >
                <ArrowIcon />
              </button>
              <div className={cn(styles.viewerWrapper, { [styles['viewerWrapper--scrolled']]: !isEpub, [styles['viewerWrapper--zoomed']]: scale > 1 })}>
                {url && isAvailableBookFormat
                  && (!isEpub ? (
                    <PdfReader
                      url={url}
                      onPdfDocumentLoadSuccess={onPdfDocumentLoadSuccess}
                      pdfPageNumber={currentLocation.currentPage}
                      height={pdfHeight}
                      scale={scale}
                    />
                  )
                    : (
                      <EpubView
                        ref={readerRef}
                        url={url}
                        location={location}
                        tocChanged={(_toc) => removeNotAvailableTocs(_toc)}
                        locationChanged={onLocationChanged}
                        getRendition={getRendition}
                      />
                    )
                  )}

              </div>
              <button
                type="button"
                className={cn(styles.button, styles.buttonNext)}
                onClick={() => onPageMove('NEXT')}
                aria-label="Следующая страница"
              />
              <button
                type="button"
                className={cn(styles.arrowButton, styles.arrowButtonNext)}
                onClick={() => onPageMove('NEXT')}
                disabled={isEpub ? currentLocation.atEnd : currentLocation.currentPage === currentLocation.totalPage}
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        )
          : <LoadingComponent percent={downloadProgress} />}

        {scale <= 1 && (
          <Footer
            currentLocation={currentLocation}
            bookTitle={bookTitle}
            onPageMove={onPageMove}
            bookAuthor={bookAuthor}
            isEpub={isEpub}
          />
        )}
      </div>

      <Wrapper
        title={currentMenu === 'option' ? 'Настройки' : undefined}
        noMargin={currentMenu === 'nav'}
        show={currentMenu !== null}
        onClose={onCloseWrapper}
      >

        <Nav
          show={currentMenu === 'nav'}
          onToggle={onCloseWrapper}
          goToChapter={goToChapter}
          goToPage={goToPage}
          toc={toc.current}
          bookTitle={bookTitle}
          bookAuthor={bookAuthor}
          coverUrl={coverUrl}
          isEpub={isEpub}
          url={url}
          currentLocation={currentLocation}
        />

        <Option
          show={currentMenu === 'option'}
          bookStyle={bookStyle}
          bookOption={bookOption}
          onBookStyleChange={onBookStyleChange}
          onBookOptionChange={onBookOptionChange}
        />

      </Wrapper>
    </>
  );
};

export default Reader;
