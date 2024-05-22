import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { styles } from "@/app/styles/style";

interface OptionProps {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Option Component
const Option: React.FC<OptionProps> = ({ id, text, isCorrect }) => {
  const [isDropped, setIsDropped] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "option",
    item: { id, text, isCorrect },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        setIsDropped(true);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // const [, drop] = useDrop(() => ({
  //   accept: "option",
  //   canDrop: () => !isDropped, // Prevent dropping if an option has already been dropped
  //   drop: (item, monitor) => {
  //     const didDrop = monitor.didDrop();
  //     if (didDrop) {
  //       setIsDropped(false); // reset the isDropped state
  //     }
  //   },
  // }));

  useEffect(() => {
    if (!isDropped) {
      setIsDropped(false);
    }
  }, [isDropped]);

  return (
    <div
      ref={(node) => drag(node)} // make it both draggable and droppable
      className={`p-2 m-2 bg-blue-200 text-black rounded w-24 h-8 flex items-center justify-center ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${isDropped ? "hidden" : ""} m-4`}
    >
      {text}
    </div>
  );
};

interface TrashProps {
  handleDrop: (item: { id: string; text: string; isCorrect: boolean }) => void;
}

// Trash Component
const Trash: React.FC<TrashProps> = ({ handleDrop }) => {
  const ref = useRef(null);
  const [droppedOptions, setDroppedOptions] = useState([]);

  const [, drop] = useDrop(() => ({
    accept: "option",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      setDroppedOptions((prev) => {
        const newOptions = [...prev, item];
        handleDrop(newOptions);
        return newOptions;
      });
    },
  }));

  const removeOption = (id) => {
    const option = droppedOptions.find((option) => option.id === id);
    setDroppedOptions((prev) => prev.filter((option) => option.id !== id));
    if (option) {
      handleDrop(option); // Call handleDrop with the dragged option when an option is dragged out of the trash
    }
  };

  return (
    <div
      ref={drop}
      className={`p-2 m-2 bg-red-200 text-black border rounded w-48 h-48 flex items-center justify-center`}
    >
      {droppedOptions.length === 0 ? (
        <p>Incorrect Words</p>
      ) : (
        droppedOptions.map((option, index) => (
          <Option
            key={index}
            id={option.id}
            text={option.text}
            isCorrect={option.isCorrect}
            handleDrop={removeOption}
          />
        ))
      )}
    </div>
  );
};

interface BlankProps {
  id: string;
  handleOptionDrop: (item: {
    id: string;
    text: string;
    isCorrect: boolean;
  }) => void;
}

const Blank: React.FC<BlankProps> = ({ handleOptionDrop }) => {
  const [droppedOption, setDroppedOption] = useState<{
    id: string;
    text: string;
    isCorrect: boolean;
  } | null>(null);

  const [, drop] = useDrop(() => ({
    accept: "option",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      // If there's already a dropped option, return it to the options list
      if (droppedOption) {
        handleOptionDrop(droppedOption);
      }
      // Call handleOptionDrop with the current item
      handleOptionDrop(item);
      // Clear the dropped option when a new one is dragged
      setDroppedOption(null);
      // Use a callback to ensure the state is updated to null before setting the new item
      setDroppedOption((prevState) => (prevState === null ? item : prevState));
    },
  }));

  return (
    <div
      ref={drop}
      className={`p-2 m-2 ${
        !droppedOption ? "bg-white" : "bg-blue-200"
      } text-black border rounded w-24 h-8 flex items-center justify-center`}
    >
      {droppedOption ? (
        <Option
          key={droppedOption.id} // Add a key here
          id={droppedOption.id}
          text={droppedOption.text}
          isCorrect={droppedOption.isCorrect}
          handleDrop={() => {
            setDroppedOption(null);
            handleOptionDrop(droppedOption);
          }}
        />
      ) : (
        "______"
      )}
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
    incorrectAnswers: number;
    totalQuestions: number;
  } | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleShowAnswers = () => {
    // setQuizSubmitted(null);
    setCurrentQuestionIndex(0);
    setQuizStarted(true);
    setShowAnswers(true);
  };

  const handleNextClick = () => {
    if (currentQuestionIndex === quiz.length - 1) {
      if (quizSubmitted?.submitted) {
        setShowAnswers(false);
      } else {
        handleQuizSubmit();
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuizRetake = () => {
    setQuizSubmitted(null);
    setSelectedOptions({});
    setCurrentQuestionIndex(0);
    setCorrectBlanks(0);
    setIncorrectAnswers(0);
    setShowAnswers(false); // Reset the showAnswers state
  };

  // Define the total number of blanks and correctly filled blanks
  const totalBlanks = quiz[currentQuestionIndex]?.question
    .split(" ")
    .filter((word) => word.startsWith("{blank")).length;
  const [correctBlanks, setCorrectBlanks] = useState(0);
  const [options, setOptions] = useState(quiz[currentQuestionIndex]?.options);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const [optionInBlank, setOptionInBlank] = useState(null);

  const handleOptionDrop = (item) => {
    // Update the options and the option in the blank
    setOptions((prevOptions) => {
      // If there's already an option in the blank, add it back to the options list
      const newOptions = optionInBlank
        ? [...prevOptions, optionInBlank]
        : prevOptions;
      // Remove the dropped option from the options list
      return newOptions.filter((option) => option.id !== item.id);
    });
    // Update the option in the blank
    setOptionInBlank(item);
    // If the dropped option is correct, increment the correctBlanks
    if (item.isCorrect) {
      setCorrectBlanks((prevCorrectBlanks) => prevCorrectBlanks + 1);
    }
  };

  useEffect(() => {
    if (quiz) {
      setQuizStarted(false);
      setCurrentQuestionIndex(0);
      setQuizSubmitted(null);
      setSelectedOptions({});
    }
  }, [quiz]);

  useEffect(() => {
    setOptions(quiz[currentQuestionIndex]?.options);
  }, [currentQuestionIndex, quiz]);

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
    const incorrectAnswers = quiz.length - correctAnswers;
    setQuizSubmitted({
      submitted: true,
      correctAnswers: correctAnswers,
      incorrectAnswers: incorrectAnswers,
      totalQuestions: quiz.length,
    });

    // If all blanks are filled correctly, increment the score
    if (correctBlanks === totalBlanks) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  return (
    <>
      {!quizStarted && !quizSubmitted && (
        <button
          onClick={() => setQuizStarted(true)}
          className={`${styles.button} !w-[unset] text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
        >
          Start
        </button>
      )}
      {quizStarted && !quizSubmitted?.submitted && !showAnswers && (
        <div className="flex flex-col justify-center items-center bg-gray-800 p-10 text-blue-950">
          {quiz[currentQuestionIndex] && (
            <div className="flex flex-col items-center">
              <h2 className="flex flex-wrap items-center text-3xl font-semibold text-white mb-5">
                Question:{" "}
                {quiz[currentQuestionIndex].category === "traditional"
                  ? quiz[currentQuestionIndex].question
                  : quiz[currentQuestionIndex].question
                      .split(" ")
                      .map((word, index) =>
                        word.startsWith("{blank") ? (
                          <Blank
                            key={index}
                            id={word}
                            handleOptionDrop={handleOptionDrop}
                          />
                        ) : (
                          <>
                            <span key={index} className="m-1">
                              {word}
                            </span>
                          </>
                        )
                      )}
              </h2>
              {quiz[currentQuestionIndex].category === "fill-in-the-blanks" && (
                <Trash handleDrop={handleOptionDrop} />
              )}
              <div className="grid grid-cols-2">
                {quiz[currentQuestionIndex].category === "traditional" &&
                  options.map((option, index) => (
                    <label
                      key={index}
                      className={`block m-2 mb-5 p-2 rounded ${
                        selectedOptions[currentQuestionIndex] === index
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      } hover:opacity-75 cursor-pointer`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${currentQuestionIndex}`}
                        value={option.isCorrect}
                        checked={
                          selectedOptions[currentQuestionIndex] === index
                        }
                        onChange={() => handleOptionSelect(index)}
                        className="hidden"
                      />
                      {option.text}
                    </label>
                  ))}
              </div>
              {quiz[currentQuestionIndex].category === "fill-in-the-blanks" && (
                <div className="flex flex-wrap bg-blue-400 max-w-fit rounded-lg">
                  {options.map((option, index) => (
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

          <div className="flex">
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className={`${styles.button} !w-[unset] mt-5 text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
            >
              <AiOutlineArrowLeft />
            </button>
            <button
              onClick={handleNextClick}
              className={`${styles.button} !w-[unset] mt-5 text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
            >
              {currentQuestionIndex === quiz.length - 1 ? (
                "Submit Quiz"
              ) : (
                <AiOutlineArrowRight />
              )}
            </button>
          </div>
        </div>
      )}
      {quizSubmitted && !showAnswers && (
        <>
          <div className="bg-gray-800 text-white p-10 flex flex-col gap-5 items-center justify-center px-64">
            <h1 className="text-4xl mb-4">Section 1: Mock Test - PART 1</h1>
            <h2
              className={
                (quizSubmitted.correctAnswers / quizSubmitted.totalQuestions) *
                  100 >=
                80
                  ? "text-green-500" + " text-6xl mb-4"
                  : "text-red-500" + " text-6xl mb-4"
              }
            >
              {(quizSubmitted.correctAnswers / quizSubmitted.totalQuestions) *
                100 >=
              80
                ? "Passed! ✅"
                : "Failed! ❌"}
            </h2>
            <div className="flex justify-around w-full mb-4">
              <div className="flex flex-col items-center">
                <p className="text-green-500 text-6xl">
                  {quiz[currentQuestionIndex].category === "traditional"
                    ? quizSubmitted.correctAnswers
                    : score}
                </p>
                <p className="text-sm">correct answers</p>
              </div>
              <div className="w-1/3 bg-gray-700 h-20 rounded-lg overflow-hidden mb-2 mx-2 relative">
                <p className="absolute inset-0 flex justify-center items-center">
                  {(quizSubmitted.correctAnswers /
                    quizSubmitted.totalQuestions) *
                    100}
                  %
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-red-500 text-6xl">
                  {quizSubmitted.incorrectAnswers}
                </p>
                <p className="text-sm">wrong answers</p>
              </div>
            </div>
            <div className="flex justify-center gap-5 w-full mb-4">
              <button
                onClick={handleQuizRetake}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Retake exam?
              </button>
              <button
                onClick={handleShowAnswers}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Your answers
              </button>
            </div>
            <div
              className={`${styles.button} !w-[unset] text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
              onClick={nextContent}
            >
              Next Lesson <AiOutlineArrowRight className="ml-2" />
            </div>
          </div>
        </>
      )}
      {showAnswers && (
        <>
          {quiz[currentQuestionIndex] && (
            <div className="flex flex-col items-center bg-gray-800 text-blue-950">
              <h2 className="flex flex-wrap items-center text-2xl mb-5 text-white p-10">
                Question:{" "}
                {quiz[currentQuestionIndex].category === "traditional"
                  ? quiz[currentQuestionIndex].question
                  : quiz[currentQuestionIndex].question
                      .split(" ")
                      .map((word, index) =>
                        word.startsWith("{blank") ? (
                          <Blank
                            key={index}
                            id={word}
                            handleOptionDrop={handleOptionDrop}
                          />
                        ) : (
                          <>
                            <span key={index} className="m-1">
                              {word}
                            </span>
                          </>
                        )
                      )}
              </h2>
              {quiz[currentQuestionIndex]?.category === "fill-in-the-blanks" && (
                <Trash handleDrop={handleOptionDrop} />
              )}
              <div className="grid grid-cols-2">
                {quiz[currentQuestionIndex]?.category === "traditional" ? (
                  options.map((option, index) => (
                    <label
                      key={index}
                      className={`block m-2 mb-5 p-2 rounded ${
                        selectedOptions[currentQuestionIndex] === index
                          ? option.isCorrect
                            ? "bg-green-500"
                            : "bg-red-500"
                          : option.isCorrect
                          ? "bg-green-500"
                          : "bg-gray-300"
                      } hover:opacity-75 cursor-pointer`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${currentQuestionIndex}`}
                        value={option.isCorrect}
                        checked={
                          selectedOptions[currentQuestionIndex] === index
                        }
                        onChange={() => handleOptionSelect(index)}
                        className="hidden"
                      />
                      {option.text}
                    </label>
                  ))
                ) : (
                  <div className="flex flex-wrap bg-blue-400 max-w-fit rounded-lg">
                    {options.map((option, index) => (
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
              <div className="flex mb-5">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(currentQuestionIndex - 1)
                  }
                  disabled={currentQuestionIndex === 0}
                  className={`${styles.button} !w-[unset] mt-5 text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
                >
                  <AiOutlineArrowLeft />
                </button>
                <button
                  onClick={handleNextClick}
                  className={`${styles.button} !w-[unset] mt-5 text-white !min-h-[40px] !py-[unset] "!cursor-no-drop opacity-[.8]" `}
                >
                  {currentQuestionIndex === quiz.length - 1 ? (
                    quizSubmitted?.submitted ? (
                      "Go to Results"
                    ) : (
                      "Submit Quiz"
                    )
                  ) : (
                    <AiOutlineArrowRight />
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default QuizWrapper;
