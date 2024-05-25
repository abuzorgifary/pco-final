import { styles } from "@/app/styles/style";
import React, { FC, useState } from "react";
import { toast } from "react-hot-toast";
import {
  AiOutlineDelete,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
  quizzes: {
    question: string;
    thumbnail: string;
    category: string;
    options: { text: string; isCorrect: boolean }[];
  }[];
  setQuizzes: (
    quizzes: {
      question: string;
      thumbnail: string;
      category: string;
      options: { text: string; isCorrect: boolean }[];
    }[]
  ) => void;
};

const CourseContent: FC<Props> = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  handleSubmit: handlleCourseSubmit,
  quizzes,
  setQuizzes,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );

  const [activeSection, setActiveSection] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [quizCategory, setQuizCategory] = useState("traditional");
  const [blankCount, setBlankCount] = useState(0);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const updatedQuizzes = quizzes.map((quiz) => ({
      ...quiz,
      category: quizCategory,
    }));

    setQuizzes(updatedQuizzes);
  };

  const handleCollapseToggle = (index: number) => {
    const updatedCollasped = [...isCollapsed];
    updatedCollasped[index] = !updatedCollasped[index];
    setIsCollapsed(updatedCollasped);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.push({ title: "", url: "" });
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    if (
      item.title === "" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.links[0].title === "" ||
      item.links[0].url === "" ||
      item.videoLength === ""
    ) {
      toast.error("Please fill all the fields first!");
    } else {
      let newVideoSection = "";

      if (courseContentData.length > 0) {
        const lastVideoSection =
          courseContentData[courseContentData.length - 1].videoSection;

        // use the last videoSection if available, else use user input
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: newVideoSection,
        videoLength: "",
        links: [{ title: "", url: "" }],
        quizzes: [],
      };

      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const addNewSection = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Please fill all the fields first!");
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoLength: "",
        videoSection: `Untitled Section ${activeSection}`,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("section can't be empty!");
    } else {
      setActive(active + 1);
      handlleCourseSubmit();
    }
  };

  const handleQuizChange = (index: number, quizIndex: number, value: any) => {
    const updatedCourseContentData = [...courseContentData];
    updatedCourseContentData[index].quizzes[quizIndex].question = value;
    setCourseContentData(updatedCourseContentData);
  };

  const handleAddBlank = (e: any, quizIndex: number) => {
    e.preventDefault();
    const quizzesCopy = [...quizzes];
    quizzesCopy[quizIndex].question += ` {blank${blankCount}}`;
    setQuizzes(quizzesCopy);
    setBlankCount(blankCount + 1);
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
      {
        question: "",
        thumbnail: "",
        category: "",
        options: [{ text: "", isCorrect: false }],
      },
    ]);
    setBlankCount(0);
  };

  const handleRemoveQuiz = (quizIndex: number) => {
    const updatedQuizzes = quizzes.filter((_, index) => index !== quizIndex);
    setQuizzes(updatedQuizzes);
  };

  const handleFileChange = (e: any, quizIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          // Create a copy of the quizzes state
          const quizzesCopy = [...quizzes];

          // Check if reader.result is a string before assigning it to thumbnail
          if (typeof reader.result === "string") {
            quizzesCopy[quizIndex].thumbnail = reader.result;
          }

          // Update the quizzes state
          setQuizzes(quizzesCopy);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any, quizIndex: number) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (typeof reader.result === "string") {
          // Create a copy of the quizzes state
          const quizzesCopy = [...quizzes];

          // Update the thumbnail of the specific quiz
          quizzesCopy[quizIndex].thumbnail = reader.result;

          // Update the quizzes state
          setQuizzes(quizzesCopy);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item: any, index: number) => {
          console.log(item);
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <>
              <div
                className={`w-full bg-[#cdc8c817] p-4 ${
                  showSectionInput ? "mt-10" : "mb-0"
                }`}
                key={index}
              >
                {showSectionInput && (
                  <>
                    <div className="flex w-full items-center">
                      <input
                        type="text"
                        className={`text-[20px] ${
                          item.videoSection === "Untitled Section"
                            ? "w-[170px]"
                            : "w-min"
                        } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                        value={item.videoSection}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoSection = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <BsPencil className="cursor-pointer dark:text-white text-black" />
                    </div>
                    <br />
                  </>
                )}

                <div className="flex w-full items-center justify-between my-0">
                  {isCollapsed[index] ? (
                    <>
                      {item.title ? (
                        <p className="font-Poppins dark:text-white text-black">
                          {index + 1}. {item.title}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div></div>
                  )}

                  {/* // arrow button for collasped video content */}
                  <div className="flex items-center">
                    <AiOutlineDelete
                      className={`dark:text-white text-[20px] mr-2 text-black ${
                        index > 0 ? "cursor-pointer" : "cursor-no-drop"
                      }`}
                      onClick={() => {
                        if (index > 0) {
                          const updatedData = [...courseContentData];
                          updatedData.splice(index, 1);
                          setCourseContentData(updatedData);
                        }
                      }}
                    />
                    <MdOutlineKeyboardArrowDown
                      fontSize="large"
                      className="dark:text-white text-black"
                      style={{
                        transform: isCollapsed[index]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                      onClick={() => handleCollapseToggle(index)}
                    />
                  </div>
                </div>
                {!isCollapsed[index] && (
                  <>
                    <div className="my-3">
                      <label className={styles.label}>Video Title</label>
                      <input
                        type="text"
                        placeholder="Project Plan..."
                        className={`${styles.input}`}
                        value={item.title}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].title = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className={styles.label}>Video Url</label>
                      <input
                        type="text"
                        placeholder="sdder"
                        className={`${styles.input}`}
                        value={item.videoUrl}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoUrl = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className={styles.label}>
                        Video Length (in minutes)
                      </label>
                      <input
                        type="number"
                        placeholder="20"
                        className={`${styles.input}`}
                        value={item.videoLength}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoLength = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className={styles.label}>Video Description</label>
                      <textarea
                        rows={8}
                        cols={30}
                        placeholder="sdder"
                        className={`${styles.input} !h-min py-2`}
                        value={item.description}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].description = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <br />
                    </div>
                    {item?.links.map((link: any, linkIndex: number) => (
                      <div className="mb-3 block" key={linkIndex}>
                        <div className="w-full flex items-center justify-between">
                          <label className={styles.label}>
                            Link {linkIndex + 1}
                          </label>
                          <AiOutlineDelete
                            className={`${
                              linkIndex === 0
                                ? "cursor-no-drop"
                                : "cursor-pointer"
                            } text-black dark:text-white text-[20px]`}
                            onClick={() =>
                              linkIndex === 0
                                ? null
                                : handleRemoveLink(index, linkIndex)
                            }
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Source Code... (Link title)"
                          className={`${styles.input}`}
                          value={link.title}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].links[linkIndex].title =
                              e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                        <input
                          type="url"
                          placeholder="Source Code Url... (Link URL)"
                          className={`${styles.input} mt-6`}
                          value={link.url}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].links[linkIndex].url =
                              e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                      </div>
                    ))}
                    <br />
                    {/* add link button */}
                    <div className="inline-block mb-4">
                      <p
                        className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                        onClick={() => handleAddLink(index)}
                      >
                        <BsLink45Deg className="mr-2" /> Add Link
                      </p>
                    </div>
                  </>
                )}
                <br />
                {/* add new content */}
                {index === courseContentData.length - 1 && (
                  <div>
                    <p
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                      onClick={(e: any) => newContentHandler(item)}
                    >
                      <AiOutlinePlusCircle className="mr-2" /> Add New Content
                    </p>
                  </div>
                )}
                <div>
                  <div className="w-[50%] mt-5">
                    <label className={`${styles.label} w-[50%]`}>
                      Course Categories
                    </label>
                    <select
                      name=""
                      id=""
                      className={`${styles.input}`}
                      value={quizCategory}
                      onChange={(e) => setQuizCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="traditional">Traditional</option>
                      <option value="fill-in-the-blanks">
                        Fill in the blanks
                      </option>
                    </select>
                  </div>
                  <br />
                  {quizCategory === "traditional" ? (
                    <>
                      {item?.quizzes?.map((quiz: any, quizIndex: number) => (
                        <>
                          <div className="w-full">
                            <input
                              type="file"
                              accept="image/*"
                              id={`file-${quizIndex}`}
                              className="hidden"
                              onChange={(e) => handleFileChange(e, quizIndex)}
                            />
                            <label
                              htmlFor={`file-${quizIndex}`}
                              className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
                                dragging ? "bg-blue-500" : "bg-transparent"
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, quizIndex)}
                            >
                              {quiz.thumbnail ? (
                                <img
                                  src={quiz?.thumbnail?.url}
                                  alt=""
                                  className="max-h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-black dark:text-white">
                                  Drag and drop your thumbnail here or click to
                                  browse
                                </span>
                              )}
                            </label>
                          </div>
                          <div key={quizIndex}>
                            <input
                              type="text"
                              name="question"
                              placeholder="What is the capital of France?"
                              required
                              className={`${styles.input} my-2`}
                              value={quiz.question}
                              onChange={(e) => {
                                const updatedCourseContentData = [
                                  ...courseContentData,
                                ];
                                updatedCourseContentData[index] = {
                                  ...updatedCourseContentData[index],
                                  quizzes: updatedCourseContentData[
                                    index
                                  ].quizzes.map((quiz, i) =>
                                    i === quizIndex
                                      ? { ...quiz, question: e.target.value }
                                      : quiz
                                  ),
                                };
                                setCourseContentData(updatedCourseContentData);
                              }}
                            />
                            {quiz.options.map(
                              (option: any, optionIndex: number) => (
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
                                    value={option.isCorrect}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        quizIndex,
                                        optionIndex,
                                        option.text,
                                        e.target.checked
                                      )
                                    }
                                    className="mb-3"
                                  />{" "}
                                  Correct answer
                                </div>
                              )
                            )}
                            <AiOutlinePlusCircle
                              style={{
                                margin: "10px 0px",
                                cursor: "pointer",
                                width: "30px",
                              }}
                              onClick={() => handleAddOption(quizIndex)}
                              className="inline-block"
                            />{" "}
                            Add Option
                            <AiOutlineMinusCircle
                              style={{
                                margin: "10px 0px",
                                cursor: "pointer",
                                width: "30px",
                              }}
                              onClick={() => handleRemoveQuiz(quizIndex)}
                              className="inline-block"
                            />
                            Remove Quiz
                          </div>
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      {item?.quizzes?.map((quiz: any, quizIndex: number) => (
                        <>
                          <div className="w-full">
                            <input
                              type="file"
                              accept="image/*"
                              id={`file-${quizIndex}`}
                              className="hidden"
                              onChange={(e) => handleFileChange(e, quizIndex)}
                            />
                            <label
                              htmlFor={`file-${quizIndex}`}
                              className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
                                dragging ? "bg-blue-500" : "bg-transparent"
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, quizIndex)}
                            >
                              {quiz.thumbnail ? (
                                <img
                                  src={quiz?.thumbnail?.url}
                                  alt=""
                                  className="max-h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-black dark:text-white">
                                  Drag and drop your thumbnail here or click to
                                  browse
                                </span>
                              )}
                            </label>
                          </div>
                          <div key={quizIndex}>
                            <input
                              type="text"
                              name="question"
                              placeholder="What is the capital of France?"
                              required
                              className={`${styles.input} my-2`}
                              value={quiz.question}
                              onChange={(e) =>
                                handleQuizChange(quizIndex, e.target.value)
                              }
                            />
                            <button
                              onClick={(e) => handleAddBlank(e, quizIndex)}
                            >
                              Add Blank
                            </button>
                            {quiz.options.map(
                              (option: any, optionIndex: number) => (
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
                                    value={option.isCorrect}
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
                              )
                            )}
                            <AiOutlinePlusCircle
                              style={{
                                margin: "10px 0px",
                                cursor: "pointer",
                                width: "30px",
                              }}
                              onClick={() => handleAddOption(quizIndex)}
                              className="inline-block"
                            />{" "}
                            Add Option
                            <AiOutlineMinusCircle
                              style={{
                                margin: "10px 0px",
                                cursor: "pointer",
                                width: "30px",
                              }}
                              onClick={() => handleRemoveQuiz(quizIndex)}
                              className="inline-block"
                            />{" "}
                            Remove Quiz
                          </div>
                        </>
                      ))}
                    </>
                  )}
                  <AiOutlinePlusCircle
                    style={{
                      margin: "10px 0px",
                      cursor: "pointer",
                      width: "30px",
                    }}
                    onClick={handleAddQuiz}
                    className="inline-block"
                  />
                  Add Quiz
                </div>
              </div>
            </>
          );
        })}
        <br />
        <div
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" /> Add new Section
        </div>
      </form>
      <br />
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default CourseContent;
