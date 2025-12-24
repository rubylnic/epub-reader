import cn from 'classnames';
import { ArrowIcon } from '../../assets/images/ArrowIcon';
import { ArrowRightIcon } from '../../assets/images/ArrowRightIcon';
import styles from './Footer.module.scss';

type Props = {
  currentLocation: { currentPage: number, totalPage: number, chapterIndex: number; atStart: boolean, atEnd: boolean },
  bookTitle: string;
  bookAuthor: string;
  onPageMove: (type: "PREV" | "NEXT") => void;
  isEpub: boolean;
};

const Footer = ({
  currentLocation, bookTitle, bookAuthor, onPageMove, isEpub,
}: Props) => {
  const {
    currentPage, totalPage, chapterIndex, atStart, atEnd,
  } = currentLocation;
  const handlePrev = () => onPageMove('PREV');
  const handleNext = () => onPageMove('NEXT');

  return (
     <div className={cn(styles.footer, {
      [styles['footer--pdf']]: !isEpub,
    })}>
      <div className={styles.container}>
        <div className={styles.left}>
          {bookTitle && (
            <span className={styles.title}>
              {bookAuthor} &laquo;{bookTitle}&raquo;
            </span>
          )}
        </div>
        <div className={styles.right}>
          <button
            type="button"
            className={styles.prev}
            onClick={handlePrev}
            disabled={atStart}
          >
            <ArrowIcon />
          </button>
          {!isEpub && totalPage > 0 && <div className={styles.totalPage}>{`стр. ${currentPage}/${totalPage}`}</div>}
          {(totalPage > 0 && chapterIndex > 0) && <div className={styles.totalPage}><span>Раздел {chapterIndex}</span> {`стр. ${currentLocation.currentPage}/${currentLocation.totalPage}`}</div>}
          <button
            type="button"
            className={styles.next}
            onClick={handleNext}
            disabled={atEnd}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Footer;
