import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import {
  BookStyle, BookOption,
} from 'types/book';
import styles from './Option.module.scss';
import Slider from '../../components/commons/Slider/Slider';
import { Checkbox } from '../../components/commons/Checkbox/Checkbox';

type Props = {
  show: boolean;
  bookStyle: BookStyle;
  bookOption: BookOption;
  onBookStyleChange: (bookStyle: BookStyle) => void;
  onBookOptionChange: (bookOption: BookOption) => void;
};

type SliderType = 'FontSize'
| 'LineHeight';

type ViewType = {
  active: boolean,
  spread: boolean
};

const Option = ({
  show,
  bookStyle,
  bookOption,
  onBookStyleChange,
  onBookOptionChange,
}: Props) => {

  const [fontSize, setFontSize] = useState<number>(bookStyle.fontSize);
  const [lineHeight, setLineHeight] = useState<number>(bookStyle.lineHeight);
  const [isVertical, setIsVertical] = useState<boolean>(bookOption.flow === 'scrolled');
  const [isSpread, setIsSpread] = useState<boolean>(bookOption.spread === 'always');
  const [viewType, setViewType] = useState<ViewType>({
    active: true,
    spread: true,
  });

  const onChangeSlider = (type: SliderType, e: any) => {
    if (!e || !e.target) return;
    switch (type) {
      case 'FontSize':
        setFontSize(Number(e.target.value));
        break;
      case 'LineHeight':
        setLineHeight(Number(e.target.value));
        break;
      default:
        break;
    }
  };

  const onChangeDirection = (isVerticalDirection: boolean) => {
    if (isVerticalDirection) {
      setIsVertical(true);
      setViewType({ ...viewType, active: false });
      onBookOptionChange({
        ...bookOption,
        flow: 'scrolled',
        spread: 'none',
      });
    } else {
      setIsVertical(false);
      setViewType({ ...viewType, active: true });
      onBookOptionChange({
        ...bookOption,
        flow: 'paginated',
      });
    }
  };

  const onClickViewType = (isSpreadView: boolean) => {
    const newSpread = isSpreadView ? 'always' : 'none';
    setViewType({ ...viewType, spread: isSpreadView });
    setIsSpread(isSpreadView);
    onBookOptionChange({ ...bookOption, spread: newSpread });
  };

  /* eslint-disable */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onBookStyleChange({
        fontSize,
        lineHeight,
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [
    fontSize,
    lineHeight,
  ]);
  /* eslint-enable */

  return (
    <>
       <div className={cn(styles.container, { [styles['container--show']]: show })}>
        <Slider
          active
          title="Размер шрифта"
          minValue={15}
          maxValue={36}
          defaultValue={fontSize}
          step={1}
          onChange={(e) => onChangeSlider('FontSize', e)}
          icon="setting1"
        />
        <Slider
          active
          title="Высота строк"
          minValue={1}
          maxValue={3}
          defaultValue={lineHeight}
          step={0.1}
          onChange={(e) => onChangeSlider('LineHeight', e)}
          icon="setting2"
          left="Маленькая"
          right="Большая"
        />
      </div>
      <div>
        <Checkbox
          label="Показать текст в 2 колонки"
          checked={isVertical ? false : isSpread}
          onChange={onClickViewType}
          disabled={isVertical}
        />
        <Checkbox
          label="Прокрутка текста"
          checked={isVertical}
          onChange={onChangeDirection}
        />
      </div>
    </>
  );
};
export default Option;
