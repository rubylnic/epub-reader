import React from 'react';
import cn from 'classnames';
import styles from './Wrapper.module.scss';
import { CrossIcon } from '../../assets/images/CrossIcon';

type Props = {
  title?: string;
  show: boolean;
  onClose: () => void;
  noMargin?: boolean;
  children?: React.ReactNode;
};

const Wrapper = ({
  title, show, onClose, noMargin, children,
}: Props) => {

  return (
    <div
      className={cn(
        styles.backdrop,
        { [styles['backdrop--visible']]: show },
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          styles.container,
          { [styles['container--visible']]: show },
          { [styles['container--noMargin']]: noMargin },
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title && <span>{title}</span>}
          <button className={styles.button} type="button" onClick={onClose}><CrossIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
