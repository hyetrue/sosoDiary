import { Button } from 'react-bootstrap';

const MyButton = ({ text, type = 'default', onClick }) => {
  const btnType = ['positive', 'positive', 'negative'].includes(type)
    ? type
    : 'default';

  return (
    <button
      className={['MyButton', `MyButton_${btnType}`].join(' ')}
      onClick={onClick}>
      {text}
    </button>
  );
};

export default MyButton;
