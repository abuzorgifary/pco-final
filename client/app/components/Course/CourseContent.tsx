import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";

type Props = {
  id: string;
  user: any;
};

const CourseContent = ({ id, user }: Props) => {
  const {
    data: contentData,
    isLoading,
    refetch,
  } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const data = contentData?.content;

  const [activeContent, setActiveContent] = useState({
    type: "video",
    index: 0,
    id: "",
  });

  const nextContent = () => {
    if (activeContent.index < data.length - 1) {
      const nextIndex = activeContent.index + 1;
      const nextItem = data[nextIndex];

      // Determine the type of the next item
      let nextType = "";
      if (nextItem.video) {
        nextType = "video";
      } else if (nextItem.quiz) {
        nextType = "quiz";
      } else if (nextItem.dragndrop) {
        nextType = "dragndrop";
      } // Add more conditions here for other types of content

      setActiveContent({
        type: nextType,
        index: nextIndex,
        id: nextItem._id,
      });
    } else {
      // Handle the case when there is no content after the current one
      alert("You have reached the end of the course.");
    }
  };
  
  

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            activeItem={1}
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute}
          />
          <div className="w-full grid 800px:grid-cols-10">
            <Heading
              title={data[activeContent.index]?.title}
              description="anything"
              keywords={data[activeContent.index]?.tags}
            />
            <div className="col-span-7">
              <CourseContentMedia
                data={data}
                id={id}
                activeContent={activeContent}
                setActiveContent={setActiveContent}
                nextContent={nextContent}
                user={user}
                refetch={refetch}
              />
            </div>
            <div className="hidden 800px:block 800px:col-span-3">
              <CourseContentList
                activeContent={activeContent}
                setActiveContent={setActiveContent}
                data={data}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CourseContent;
