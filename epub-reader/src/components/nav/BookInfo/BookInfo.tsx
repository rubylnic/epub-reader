import styles from './BookInfo.module.scss';

type Props = {
  src: string | null;
  title: string;
  author: string;
};

const BookInfo = ({
  src = '', title, author,
}: Props) => {
  return (
    <div className={styles.container}>
      {src && <img src={src} alt={title} className={styles.img} width="80" height="80" />}
      <div className={styles.content}>
        {title && <div className={styles.title}>{author} &laquo;{title}&raquo;</div>}
      </div>
    </div>
  );
};

export default BookInfo;
