import React from 'react';
import { NavItem } from 'epubjs';
import styles from './Nav.module.scss';
import NavButton from '../../components/nav/NavButton/NavButton';
import BookInfo from '../../components/nav/BookInfo/BookInfo';

type Props = {
  onToggle: () => void;
  toc: {
    subitems?: Array<NavItem>,
    id: string,
    label: string,
    href: string }[];
  bookTitle: string;
  bookAuthor: string;
  coverUrl: string | null;
  goToChapter: (href: string) => void;
};

type TocItem = {
  id: string;
  label: string;
  href: string;
  subitems?: TocItem[];
};

const Nav = ({
  onToggle, toc, bookTitle, bookAuthor, coverUrl, goToChapter,
}: Props) => {
  const onGoToChapter = (link:string) => {
    goToChapter(link);
    onToggle();
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
    <>
      <BookInfo
        src={coverUrl}
        title={bookTitle}
        author={bookAuthor}
      />
      <div className={styles.subtitle}>Оглавление</div>
      <div className={styles.tocs}>{Tocs}
      </div>
    </>
  );
};
export default Nav;
