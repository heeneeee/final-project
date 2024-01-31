import { useQuery } from '@tanstack/react-query';
import { auth } from '../../shared/firebase';
import Cs from '../viewAll/style';
import PostCard from '../mypage/PostCard/PostCard';
import { QUERY_KEYS } from '../../query/keys';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getMyPosts } from '../../api/myPostAPI';

// 내 게시물 가져오기
const MyPosts = () => {
  const authContext = useContext(AuthContext);
  const authCurrentUser = authContext?.currentUser;

  //test
  const { data: myPosts } = useQuery({
    queryKey: [QUERY_KEYS.POSTS, 'myPosts'],
    queryFn: getMyPosts,
    enabled: !!authCurrentUser,
    staleTime: 1000 * 60
  });

  return (
    <Cs.Contents>
      {myPosts?.length! > 0 ? (
        myPosts?.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p style={{ display: 'flex', justifyContent: 'center' }}>내 게시물이 없습니다.</p>
      )}
    </Cs.Contents>
  );
};
export default MyPosts;
