import PostBox from "../share/PostBox";
import PostedFeed from "../share/PostedFeed";
import StoryAdd from "../share/StoryAdd";

const Feed = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <StoryAdd />
      <PostBox />
      <PostedFeed />
    </div>
  );
};

export default Feed;
