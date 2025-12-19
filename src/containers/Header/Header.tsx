import cn from 'classnames';
import styles from './Header.module.scss';
import { ArrowBackIcon } from '../../assets/images/ArrowBackIcon';
import { ContentIcon } from '../../assets/images/ContentIcon';
import { SettingsIcon } from '../../assets/images/SettingsIcon';
import { CrossIcon } from '../../assets/images/CrossIcon';

type Props = {
  onMenuToggle: (type: 'nav' | 'option') => void;
  id: string;
  bookTitle: string;
  bookAuthor: string;
  currentMenu: string | null;
};

const Header = ({
  onMenuToggle,
  bookTitle,
  bookAuthor,
  id,
  currentMenu,
}: Props) => {

  const onGoBackClick = () => {
    if (id) {
      window.location.href = `${id}?dsf=1`;
    }
  };

  const openNavMenu = () => {
    onMenuToggle('nav');
  };

  const openOptionMenu = () => {
    onMenuToggle('option');
  };

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button type="button" className={styles.backButton} onClick={onGoBackClick}><ArrowBackIcon /><span>Вернуться</span></button>
          {bookTitle && <h3 className={styles.title}>{bookAuthor} &laquo;{bookTitle}&raquo;</h3>}
        </div>
        <div className={styles.right}>
          <button
            type="button"
            className={cn(styles.button, {
              [styles['button--active']]: currentMenu === 'nav',
            })}
            onClick={openNavMenu}
          >
            <ContentIcon />
          </button>
          <button
            type="button"
            className={cn(styles.button, {
              [styles['button--active']]: currentMenu === 'option',
            })}
            onClick={openOptionMenu}
          >
            <SettingsIcon />
          </button>
          <button type="button" className={cn(styles.button)} onClick={onGoBackClick}>
            <CrossIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Header;
