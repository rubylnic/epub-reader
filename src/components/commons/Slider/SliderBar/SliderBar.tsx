import React from 'react';
import cn from 'classnames';
import styles from './SliderBar.module.scss';

type SliderBarProps = {
  percentage: number;
  active: boolean;
};

const SliderBar = ({ percentage, active }: SliderBarProps) => {
  const style = {
    width: `${percentage}%`,
  };

  return (
    <div
      className={cn(styles.sliderBar, {
        [styles.active]: active,
      })}
      style={style}
    />
  );
};

export default SliderBar;
