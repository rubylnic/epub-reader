import { ArrowIcon } from '../../assets/images/ArrowIcon';
import { ArrowRightIcon } from '../../assets/images/ArrowRightIcon';
import styles from './Footer.module.scss';

type Props = {
  currentLocation: { currentPage: number, totalPage: number, chapterIndex: number; atStart: boolean, atEnd: boolean },
  bookTitle: string;
  bookAuthor: string;
  onPageMove: any;
};

const Footer = ({
  currentLocation, bookTitle, bookAuthor, onPageMove,
}: Props) => {
  const {
    currentPage, totalPage, chapterIndex, atStart, atEnd,
  } = currentLocation;
  const handlePrev = () => onPageMove('PREV');
  const handleNext = () => onPageMove('NEXT');

  return (
    <div className={styles.footer}>
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
          {(totalPage > 0 && chapterIndex > 0) && <div className={styles.totalPage}><span>Раздел {chapterIndex}</span> {`стр. ${currentPage}/${totalPage}`}</div>}
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
