import styles from './LoadingComponent.module.scss';

type Props = {
  percent: number;
};

const LoadingComponent = ({ percent }:Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <div className={styles.percent}>{percent}%</div>
    </div>
  );
};

export default LoadingComponent;
