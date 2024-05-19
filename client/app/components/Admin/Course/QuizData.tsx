import { styles } from "@/app/styles/style";
import React, { FC } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";

type Props = {
  quizzes: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
  }[];
  setQuizzes: (
    quizzes: {
      question: string;
      options: { text: string; isCorrect: boolean }[];
    }[]
  ) => void;
  active: number;
  setActive: (active: number) => void;
};

const QuizData: FC<Props> = ({ quizzes, setQuizzes, active, setActive }) => {
  const handleQuizChange = (index: number, value: any) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[index].question = value;
    setQuizzes(updatedQuizzes);
    console.log("QuestionChange", quizzes);
  };

  const handleOptionChange = (
    quizIndex: number,
    optionIndex: number,
    value: any,
    isCorrect: boolean
  ) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[quizIndex].options[optionIndex] = {
      text: value,
      isCorrect: isCorrect,
    };
    setQuizzes(updatedQuizzes);
    console.log("Option change", quizzes);
  };

  const handleAddOption = (quizIndex: number) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[quizIndex].options.push({ text: "", isCorrect: false });
    setQuizzes(updatedQuizzes);
  };

  const handleAddQuiz = () => {
    setQuizzes([
      ...quizzes,
      { question: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  const handleRemoveQuiz = (quizIndex: number) => {
    const updatedQuizzes = quizzes.filter((_, index) => index !== quizIndex);
    setQuizzes(updatedQuizzes);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (quizzes[quizzes.length - 1]?.question !== "") {
      setActive(active + 1);
    } else {
      toast.error("Please fill the fields for go to next!");
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          {" "}
          What are the quizzes for this course?{" "}
        </label>
        <br />
        {quizzes.map((quiz: any, quizIndex: number) => (
          <div key={quizIndex}>
            <input
              type="text"
              name="question"
              placeholder="What is the capital of France?"
              required
              className={`${styles.input} my-2`}
              value={quiz.question}
              onChange={(e) => handleQuizChange(quizIndex, e.target.value)}
            />
            {quiz.options.map((option: any, optionIndex: number) => (
              <div key={optionIndex}>
                <input
                  type="text"
                  name="text"
                  placeholder="Paris"
                  required
                  className={`${styles.input} my-2`}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(
                      quizIndex,
                      optionIndex,
                      e.target.value,
                      option.isCorrect
                    )
                  }
                />
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) =>
                    handleOptionChange(
                      quizIndex,
                      optionIndex,
                      option.text,
                      e.target.checked
                    )
                  }
                />{" "}
                Correct answer
              </div>
            ))}
            <AiOutlinePlusCircle
              style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
              onClick={() => handleAddOption(quizIndex)}
              className="inline-block"
            />{" "}
            Add Option
            <AiOutlineMinusCircle
              style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
              onClick={() => handleRemoveQuiz(quizIndex)}
            />
          </div>
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddQuiz}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          {" "}
          Prev{" "}
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          {" "}
          Next{" "}
        </div>
      </div>
    </div>
  );
};

export default QuizData;
