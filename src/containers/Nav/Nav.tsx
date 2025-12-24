import React, { useState } from 'react';
import { NavItem } from 'epubjs';
import { Document, Page } from 'react-pdf';
import cn from 'classnames';
import styles from './Nav.module.scss';
import BookInfo from '../../components/nav/BookInfo/BookInfo';
import NavButton from '../../components/nav/NavButton/NavButton';

type Props = {
  show: boolean;
  onToggle: () => void;
  toc: {
    subitems?: Array<NavItem>,
    id: string,
    label: string,
    href: string
  }[];
  bookTitle: string;
  bookAuthor: string;
  coverUrl: string | null;
  goToChapter: (href: string) => void;
  goToPage: (index: number) => void;
  isEpub: boolean;
  url: string | ArrayBuffer | null;
  currentLocation: { currentPage: number, totalPage: number, atStart: boolean, atEnd: boolean },
};

type TocItem = {
  id: string;
  label: string;
  href: string;
  subitems?: TocItem[];
};

const Nav = ({
  show,
  onToggle,
  toc,
  bookTitle,
  bookAuthor,
  coverUrl,
  goToChapter,
  goToPage,
  isEpub,
  url,
  currentLocation,
}: Props) => {

  const [isLoaded, setIsLoaded] = useState(false);

  const onGoToChapter = (link: string) => {
    goToChapter(link);
    onToggle();
  };

  const onGoToPage = (index: number) => {
    goToPage(index);
    onToggle();
  };

  const onNavDocumentLoadSuccess = () => {
    setIsLoaded(true);
  };

  function renderToc(items: TocItem[], level = 0) {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <NavButton
          message={item.label}
          onClick={() => onGoToChapter(item.href)}
          level={level}
        />
        {item.subitems?.length ? renderToc(item.subitems, level + 1) : null}
      </React.Fragment>
    ));
  }

  const Tocs = renderToc(toc);

  return (
     <div className={cn(styles.container, { [styles['container--show']]: show })}>
      <BookInfo
        src={coverUrl}
        title={bookTitle}
        author={bookAuthor}
      />
      {isEpub ? (
        <><div className={styles.subtitle}>Оглавление</div>
          <div className={styles.tocs}>{Tocs}</div>
        </>
      ) : (
        <Document file={url} loading="">
          <div className={styles.pages}>
            {Array.from(new Array(currentLocation.totalPage), (_, index) => (
              <button
                type="button"
                className={cn(styles.page, { [styles['page--active']]: currentLocation.currentPage === index + 1, [styles['page--loaded']]: isLoaded })}
                key={index + 1}
                onClick={() => onGoToPage(index + 1)}
              >
                <div>
                  <Page
                    pageNumber={index + 1}
                    width={140}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onRenderSuccess={() => onNavDocumentLoadSuccess()}
                  />
                </div>
                <span className={styles.pageIndex}>{index + 1}</span>
              </button>
            ))}
          </div>
        </Document>
      )}
    </div>
  );
};
export default Nav;
