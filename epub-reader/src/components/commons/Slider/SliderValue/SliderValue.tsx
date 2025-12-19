import SliderBar from '../SliderBar/SliderBar';
import styles from './SliderValue.module.scss';

type Props = {
  active: boolean;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  step: number;
  onChange: (e: any) => void;
};

const SliderValue = ({
  active,
  minValue,
  maxValue,
  defaultValue,
  step,
  onChange,
}: Props) => {
  const percentage = Math.round((defaultValue - minValue) / (maxValue - minValue) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <SliderBar
        active={active}
        percentage={percentage}
      />
      <input
        type="range"
        min={minValue}
        max={maxValue}
        defaultValue={defaultValue}
        step={step}
        onChange={onChange}
        disabled={!active}
        className={`${styles.slider} ${active ? styles.active : ''}`}
      />
    </div>
  );
};

export default SliderValue;
