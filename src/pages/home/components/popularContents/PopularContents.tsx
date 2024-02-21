import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { getAdminPostList, getFirstPage } from 'api/pageListApi';
import { QUERY_KEYS } from 'query/keys';
import '../swiperStyle.css';
import Carousel from './carousel/Carousel';
import St from './style';

const PopularContents = () => {
  const queryClient = useQueryClient();
  const handleHover = async () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: [QUERY_KEYS.POSTS, QUERY_KEYS.TOTAL],
      queryFn: () => getFirstPage('total'),
      initialPageParam: undefined,
      staleTime: 60_000 * 5
    });
  };

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <St.UserContents>
      <St.TitleContainer>
        <h1>인기 게시물</h1>
        <St.SubTitle>
          <p>망고에서 제일 인기 있는 게시물들을 둘러보세요.</p>
          <Link to={'/community'} onClick={handleLinkClick}>
            <button type="button" onMouseEnter={handleHover}>
              {'전체보기 >'}
            </button>
          </Link>
        </St.SubTitle>
      </St.TitleContainer>
      <Carousel />
    </St.UserContents>
  );
};

export default PopularContents;
