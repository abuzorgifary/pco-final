import React, { useState } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";
import { AiOutlineArrowRight } from "react-icons/ai";
import { styles } from "@/app/styles/style";

interface OptionProps {
  id: string;
  text: string;
  isCorrect: boolean;
}

const Option: React.FC<OptionProps> = ({ id, text, isCorrect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "option",
    item: { id, text, isCorrect }, // pass the text here
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 m-2 bg-blue-200 text-black rounded w-24 h-8 flex items-center justify-center ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {text}
    </div>
  );
};

interface BlankProps {
  id: string;
  handleDrop: (item: { id: string; text: string; isCorrect: boolean }) => void;
}

const Blank: React.FC<BlankProps> = ({ id, handleDrop }) => {
  const [droppedOption, setDroppedOption] = useState<{
    id: string;
    text: string;
    isCorrect: boolean;
  } | null>(null);

  const [, drop] = useDrop(() => ({
    accept: "option",
    drop: (
      item: { id: string; text: string; isCorrect: boolean },
      monitor: DropTargetMonitor
    ) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      setDroppedOption(item);
      handleDrop(item);
    },
  }));

  return (
    <div
      ref={drop}
      className={`p-2 m-2 ${
        !droppedOption ? "bg-white" : "bg-blue-200"
      } text-black border rounded w-24 h-8 flex items-center justify-center`}
    >
      {droppedOption?.text || "______"}
    </div>
  );
};

interface QuizWrapperProps {
  quiz: any[];
  setActiveContent: React.Dispatch<
    React.SetStateAction<{ type: string; index: number }>
  >;
  nextContent: () => void;
}

const QuizWrapper: React.FC<QuizWrapperProps> = ({
  quiz,
  setActiveContent,
  nextContent,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, number>
  >({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState<{
    submitted: boolean;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [correctFillInBlanksAnswers, setCorrectFillInBlanksAnswers] =
    useState(0); // add this line
  console.log(correctFillInBlanksAnswers);
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleDrop = (item: {
    id: string;
    text: string;
    isCorrect: boolean;
  }) => {
    if (item.isCorrect) {
      setCorrectFillInBlanksAnswers(
        (prevCorrectAnswers) => prevCorrectAnswers + 1
      );
    }
  };

  const handleQuizSubmit = () => {
    const correctAnswers = Object.keys(selectedOptions).reduce(
      (count, quizIndex) => {
        const correctOptionIndex = quiz[quizIndex].options.findIndex(
          (option) => option.isCorrect
        );
        return (
          count + (selectedOptions[quizIndex] === correctOptionIndex ? 1 : 0)
        );
      },
      0
    );
    setQuizSubmitted({
      submitted: true,
      correctAnswers: correctAnswers,
      totalQuestions: quiz.length,
    });
  };

  return (
    <>
      {quizStarted ? (
        <>
          {quiz[currentQuestionIndex] && (
            <div>
              <h2 className="flex flex-wrap items-center text-2xl mb-5">
                Question:{" "}
                {quiz[currentQuestionIndex].category === "traditional"
                  ? quiz[currentQuestionIndex].question
                  : // Render fill-in-the-blanks question
                    quiz[currentQuestionIndex].question
                      .split(" ")
                      .map((word, index) =>
                        word.startsWith("{blank") ? (
                          <Blank
                            key={index}
                            id={word}
                            handleDrop={handleDrop}
                          />
                        ) : (
                          <span className="m-1">{word}</span>
                        )
                      )}
              </h2>

              {quiz[currentQuestionIndex].category === "traditional" ? (
                // Render traditional quiz options
                quiz[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className="m-2 mb-5">
                    <input
                      type="radio"
                      name={`quiz-${currentQuestionIndex}`}
                      value={option.isCorrect}
                      checked={selectedOptions[currentQuestionIndex] === index}
                      onChange={() => handleOptionSelect(index)}
                    />
                    <label>{option.text}</label>
                  </div>
                ))
              ) : (
                // Render fill-in-the-blanks quiz options
                <div className="flex flex-wrap bg-blue-400 max-w-fit rounded-lg">
                  {quiz[currentQuestionIndex].options.map((option, index) => (
                    <Option
                      key={index}
                      id={`option-${index}`}
                      text={option.text}
                      isCorrect={option.isCorrect}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={
              currentQuestionIndex === quiz.length - 1
                ? handleQuizSubmit
                : () => setCurrentQuestionIndex(currentQuestionIndex + 1)
            }
            className={`${styles.button} !w-[unset] mt-5 text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
          >
            {currentQuestionIndex === quiz.length - 1
              ? "Submit Quiz"
              : "Next Question"}
          </button>
          {quizSubmitted && (
            <>
              <div>
                <p>
                  You got {quizSubmitted.correctAnswers} correct out of{" "}
                  {quizSubmitted.totalQuestions}.
                </p>
              </div>
              <div
                className={`${styles.button} !w-[unset] text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
                onClick={nextContent}
              >
                Next Lesson <AiOutlineArrowRight className="ml-2" />
              </div>
            </>
          )}
        </>
      ) : (
        <button
          onClick={() => setQuizStarted(true)}
          className={`${styles.button} !w-[unset] text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
        >
          Start
        </button>
      )}
    </>
  );
};

export default QuizWrapper;
