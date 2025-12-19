import cn from 'classnames';
import styles from './NavButton.module.scss';

type Props = {
  message: string;
  onClick: () => void;
  level?: number;
};

const NavButton = ({ message, onClick, level }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        cn(styles.button, styles[`button--level-${level}`])
      }
    >
      {message}
    </button>
  );
};

export default NavButton;
