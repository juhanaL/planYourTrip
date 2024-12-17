import '../styles/TodoButton.css';

interface Props {
  text: string;
  handleClick: () => void;
}

const TodoButton = ({ text, handleClick }: Props) => {
  return (
    <div>
      <button className="todo-button" onClick={handleClick} type="button">
        {text}
      </button>
    </div>
  );
};

export default TodoButton;
