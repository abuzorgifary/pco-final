import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { RiDragDropFill } from "react-icons/ri";
import { VscChecklist } from "react-icons/vsc";

type Props = {
  data: any;
  activeContent: { type: string; index: number; id: string };
  setActiveContent: React.Dispatch<
    React.SetStateAction<{ type: string; index: number; id: string }>
  >;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  );

  // Find unique video sections
  const videoSections: string[] = [
    ...new Set<string>(props.data?.map((item: any) => item.videoSection)),
  ];

  let totalCount: number = 0; // Total count of videos from previous sections

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  console.log(props.data);

  return (
    <div
      className={`mt-[15px] w-full ${
        !props.isDemo && "ml-[-30px] min-h-screen sticky top-24 left-0 z-30"
      }`}
    >
      {videoSections.map((section: string, sectionIndex: number) => {
        const isSectionVisible = visibleSections.has(section);

        // Filter videos by section
        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section
        );

        const sectionVideoCount: number = sectionVideos.length; // Number of videos in the current section
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + item.videoLength,
          0
        );
        const sectionStartIndex: number = totalCount; // Start index of videos within the current section
        totalCount += sectionVideoCount; // Update the total count of videos

        const sectionContentHours: number = sectionVideoLength / 60;

        return (
          <div
            className={`${
              !props.isDemo &&
              "border-b border-[#0000001c] dark:border-[#ffffff8e] pb-2"
            }`}
            key={section}
          >
            <div className="w-full flex">
              {/* Render video section */}
              <div className="w-full flex justify-between items-center">
                <h2 className="text-[22px] text-black dark:text-white">
                  {section}
                </h2>
                <button
                  className="mr-4 cursor-pointer text-black dark:text-white"
                  onClick={() => toggleSection(section)}
                >
                  {isSectionVisible ? (
                    <BsChevronUp size={20} />
                  ) : (
                    <BsChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>
            <h5 className="text-black dark:text-white">
              {sectionVideoCount} Lessons ·{" "}
              {sectionVideoLength < 60
                ? sectionVideoLength
                : sectionContentHours.toFixed(2)}{" "}
              {sectionVideoLength > 60 ? "hours" : "minutes"}
            </h5>
            <br />
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index; // Calculate the video index within the overall list
                  const contentLength: number = item.videoLength / 60;
                  return (
                    <div key={index}>
                      <div
                        className={`w-full ${
                          videoIndex === props.activeContent.index &&
                          props.activeContent.type === "video" &&
                          props.activeContent.id === item._id
                            ? "bg-slate-800"
                            : ""
                        } cursor-pointer transition-all p-2`}
                        key={`${item._id}-${videoIndex}`}
                        onClick={() =>
                          props.isDemo
                            ? null
                            : props?.setActiveContent({
                                type: "video",
                                index: videoIndex,
                                id: item._id,
                              })
                        }
                      >
                        <div className="flex items-start">
                          <div>
                            <MdOutlineOndemandVideo
                              size={25}
                              className="mr-2"
                              color="#1cdada"
                            />
                          </div>
                          <h1 className="text-[18px] inline-block break-words text-black dark:text-white">
                            {item.title}
                          </h1>
                        </div>
                        <h5 className="pl-8 text-black dark:text-white">
                          {item.videoLength > 60
                            ? contentLength.toFixed(2)
                            : item.videoLength}{" "}
                          {item.videoLength > 60 ? "hours" : "minutes"}
                        </h5>
                      </div>
                      {item.pdfs.map((pdf: any, pdfIndex: number) => (
                        <div
                          className={`w-full ${
                            props.activeContent.type === "pdf" &&
                            props.activeContent.index === pdfIndex &&
                            props.activeContent.id === pdf._id
                              ? "bg-slate-800"
                              : ""
                          } cursor-pointer transition-all p-2`}
                          key={`${pdf._id}-${pdfIndex}`}
                          onClick={() =>
                            props.isDemo
                              ? null
                              : props?.setActiveContent({
                                  type: "pdf",
                                  index: pdfIndex,
                                  id: pdf._id,
                                })
                          }
                        >
                          <h1 className="text-[18px] inline-block break-words text-black dark:text-white">
                            {" "}
                            <RiDragDropFill className="inline-block text-2xl text-cyan-500" />{" "}
                            PDFs{" "}
                          </h1>
                        </div>
                      ))}

                      <div
                        className={`w-full ${
                          props.activeContent.type === "traditional"
                            ? "bg-slate-800"
                            : ""
                        } cursor-pointer transition-all p-2`}
                        key={`quiz-${sectionIndex}`}
                        onClick={() =>
                          props.isDemo
                            ? null
                            : props?.setActiveContent({
                                type: "traditional",
                                index: sectionIndex,
                              })
                        }
                      >
                        <h1 className="text-[18px] inline-block break-words text-black dark:text-white">
                          {" "}
                          <VscChecklist className="inline-block text-2xl text-cyan-500" />{" "}
                          Quiz Practice{" "}
                        </h1>
                      </div>
                      <div
                        className={`w-full ${
                          props.activeContent.type === "dragndrop"
                            ? "bg-slate-800"
                            : ""
                        } cursor-pointer transition-all p-2`}
                        key={`dragndrop-${sectionIndex}`}
                        onClick={() =>
                          props.isDemo
                            ? null
                            : props?.setActiveContent({
                                type: "dragndrop",
                                index: sectionIndex,
                              })
                        }
                      >
                        <h1 className="text-[18px] inline-block break-words text-black dark:text-white">
                          {" "}
                          <RiDragDropFill className="inline-block text-2xl text-cyan-500" />{" "}
                          Drag n Drop{" "}
                        </h1>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
