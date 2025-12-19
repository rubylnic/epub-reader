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

type Props = {
  url: ArrayBuffer | null;
  id: string;
  bookTitle: string;
  bookAuthor: string;
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

const Reader = ({
  url, id, bookTitle, bookAuthor, coverUrl, downloadProgress,
}: Props) => {
  const { pathname } = window.location;
  const bookId = pathname.split('/').pop();
  const savedBookInfo = localStorage.getItem(`book_${bookId}`);
  const parsedBookInfo = savedBookInfo ? JSON.parse(savedBookInfo) : null;

  const [currentLocation, setCurrentLocation] = useState({
    currentPage: 0, totalPage: 0, chapterIndex: 0, atStart: false, atEnd: false,
  });

  const renditionRef = useRef<Rendition | undefined>(undefined);
  const isInitialLocationRef = useRef(true);
  const toc = useRef<NavItem[]>([]);
  const totalPagesRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
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
      if (readerRef.current) {
        renditionRef.current?.prev();
      }
    }

    if (type === 'NEXT') {
      if (readerRef.current) {
        renditionRef.current?.next();
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

  const setLSBookInfo = (loc:string, percentLoc: number) => {
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
          currentMenu={currentMenu}
        />
        {url ? (
          <div
            className={styles.container}
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
                disabled={currentLocation.atStart}
              >
                <ArrowIcon />
              </button>
              <div
                className={styles.viewerWrapper}
              >
                {url && (
                <EpubView
                  ref={readerRef}
                  url={url}
                  location={location}
                  tocChanged={(_toc) => removeNotAvailableTocs(_toc)}
                  locationChanged={onLocationChanged}
                  getRendition={getRendition}
                />
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
                disabled={currentLocation.atEnd}
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        )
          : <LoadingComponent percent={downloadProgress} />}
        <Footer
          currentLocation={currentLocation}
          bookTitle={bookTitle}
          onPageMove={onPageMove}
          bookAuthor={bookAuthor}
        />
      </div>

      <Wrapper
        title={currentMenu === 'option' ? 'Настройки' : undefined}
        noMargin={currentMenu === 'nav'}
        show={currentMenu !== null}
        onClose={onCloseWrapper}
      >
        {currentMenu === 'nav' ? (
          <Nav
            onToggle={onCloseWrapper}
            goToChapter={goToChapter}
            toc={toc.current}
            bookTitle={bookTitle}
            bookAuthor={bookAuthor}
            coverUrl={coverUrl}
          />
        ) : null}

        {currentMenu === 'option' ? (
          <Option
            bookStyle={bookStyle}
            bookOption={bookOption}
            onBookStyleChange={onBookStyleChange}
            onBookOptionChange={onBookOptionChange}
          />
        ) : null}
      </Wrapper>
    </>
  );
};

export default Reader;
