import styles from './ErrorMessage.module.scss';

type Props = {
  message: string;
};

const ErrorMessage = ({ message }:Props) => {
  return (
    <div className={styles.container}>
      {message}
    </div>
  );
};

export default ErrorMessage;
