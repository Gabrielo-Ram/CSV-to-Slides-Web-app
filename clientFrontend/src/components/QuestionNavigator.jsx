import { GoDotFill, GoDot } from "react-icons/go";

function QuestionNavigator({ numberOfQuestions, currentQuestion }) {
  const elements = [];
  for (let i = 0; i < numberOfQuestions; i++) {
    if (i === currentQuestion) {
      elements.push(<GoDotFill className="h-full w-[4%]" />);
    } else {
      elements.push(<GoDot className="h-full w-[4%]" />);
    }
  }

  return (
    <div className="flex gap-2 w-full h-[4%] justify-center">{elements}</div>
  );
}

export default QuestionNavigator;
