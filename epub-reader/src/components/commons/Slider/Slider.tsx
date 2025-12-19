import SliderValue from '@components/option/Slider/SliderValue/SliderValue';
import styles from './Slider.module.scss';
import { iconMap } from '../../../images/icons/iconMap';

type Props = {
  active: boolean;
  title: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  step: number;
  onChange: (e: any) => void;
  icon: string;
  left?: string;
  right?: string;
};

const Slider = ({
  active,
  title,
  minValue,
  maxValue,
  defaultValue,
  step,
  onChange,
  icon,
  left,
  right,
}: Props) => {
  const onChangeValue = (e: any) => {
    if (!active) return;
    onChange(e);
  };

  const IconComponent = iconMap[icon];

  return (
    <div className={styles.slider}>
      <h4 className={styles.title}>{title}</h4>

      <div className={styles.container}>
        {IconComponent && <IconComponent />}
        <div className={styles.sliderContainer}>
          {left && <span>{left}</span>}
          <SliderValue
            active={active}
            minValue={minValue}
            maxValue={maxValue}
            defaultValue={defaultValue}
            step={step}
            onChange={onChangeValue}
          />
          {right && <span>{right}</span>}
        </div>
      </div>
    </div>
  );
};

export default Slider;
