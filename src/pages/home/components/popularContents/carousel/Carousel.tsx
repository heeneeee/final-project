import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from 'api/authApi';
import { getPopularPosts } from 'api/homeApi';
import defaultUserProfile from 'assets/realMango.png';
import PostContentPreview from 'components/PostContentPreview';
import { AuthContext } from 'context/AuthContext';
import { useLikeButton } from 'hooks/useLikeButton';
import useSwiperNavigation from 'hooks/useSwiperNavigation';
import { QUERY_KEYS } from 'query/keys';
import { useContext, useEffect, useState } from 'react';
import { GoComment, GoEye, GoHeart } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { getThumbnailSource } from 'util/getThumbnailSource';
import CarouselSkeleton from './skeleton/CarouselSkeleton';

import swipeLeft from 'assets/icons/swipeLeft.png';
import swipeRight from 'assets/icons/swipeRight.png';
import 'swiper/css';
import 'swiper/css/pagination';
import St from './style';

const Carousel = () => {
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser;
  const currentUserId = currentUser?.uid;

  const {
    data: popularPosts,
    isLoading: popularPostsIsLoading,
    error: popularPostsError
  } = useQuery({
    queryKey: [QUERY_KEYS.POSTS, QUERY_KEYS.POPULAR],
    queryFn: getPopularPosts,
    staleTime: 60_000 * 5
  });
  if (popularPostsError) {
    console.log('인기 게시물 가져오기 실패!', popularPostsError);
  }

  const {
    data: users,
    isLoading: userIsLoading,
    error: usersError
  } = useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: getAllUsers,
    staleTime: 60_000 * 5
  });

  if (usersError) {
    console.log('users 데이터 가져오기 실패!', usersError);
  }

  // swiper 관련 ----
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);

  // 커스텀 Swiper handler
  const { goNext, goPrev } = useSwiperNavigation({
    swiperInstance,
    currentIndex,
    setCurrentIndex,
    maxIndex: popularPosts ? popularPosts.length - 1 : 0
  });

  const handleSlideChange = (swiper: SwiperClass) => {
    setCurrentIndex(swiper.realIndex);
  };
  // ---- swiper 관련

  const onClickLikeButton = useLikeButton();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 431) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(4);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <St.Container>
      {popularPostsIsLoading && userIsLoading ? (
        <CarouselSkeleton />
      ) : (
        <St.SlideWrapper>
          <Swiper
            pagination={{
              clickable: true
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
            // onSlideChange={() => {}}
            // onSwiper={(swiper: SwiperClass) => {}}
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
            navigation={true}
            slidesPerView={slidesPerView}
          >
            {popularPosts && popularPosts.length === 0 ? (
              <St.PlaceHolder>인기 게시물 데이터 없습니다.</St.PlaceHolder>
            ) : (
              popularPosts?.map((post, idx) => {
                const user = users?.find((user) => user.uid === post.uid);
                return (
                  <SwiperSlide key={idx}>
                    <Link key={post.id} to={`/detail/${post.id}`}>
                      <St.Slide>
                        <St.CoverImage>
                          <img src={getThumbnailSource(post.coverImages)} alt={post.title} />
                        </St.CoverImage>
                        <St.SlideHeader>
                          <div>
                            <St.UserProfileImage>
                              <img src={user?.profileImg || defaultUserProfile} alt="profile" />
                            </St.UserProfileImage>
                            <St.UserProfileName>
                              <span>{user?.displayName}</span>
                            </St.UserProfileName>
                          </div>
                          <button type="button" onClick={(e) => onClickLikeButton(e, post.id)}>
                            {currentUserId && post.likedUsers?.includes(currentUserId) ? (
                              <St.HeartFillIcon />
                            ) : (
                              <St.HeartIcon />
                            )}
                          </button>
                        </St.SlideHeader>
                        <St.SlideBottom>
                          <St.TitleAndContent>
                            <h1>{post.title}</h1>
                            <div>
                              <PostContentPreview postContent={post.content || ''} />
                            </div>
                          </St.TitleAndContent>
                          <St.InteractionInfo>
                            <div>
                              <GoEye />
                              <span>{post.viewCount?.toLocaleString() || 0}</span>
                            </div>
                            <div>
                              <GoHeart />
                              <span>{post.likeCount?.toLocaleString() || 0}</span>
                            </div>
                            <div>
                              <GoComment />
                              <span>{post.commentCount?.toLocaleString() || 0}</span>
                            </div>
                          </St.InteractionInfo>
                        </St.SlideBottom>
                      </St.Slide>
                    </Link>
                  </SwiperSlide>
                );
              })
            )}
          </Swiper>
        </St.SlideWrapper>
      )}
      {popularPosts && (
        <St.NavigationButtonContainer>
          <div onClick={goPrev}>{currentIndex > 0 && <img src={swipeLeft} alt="Previous" />}</div>
          <div onClick={goNext}>
            {currentIndex < Math.floor(popularPosts.length - slidesPerView) && <img src={swipeRight} alt="Next" />}
          </div>
        </St.NavigationButtonContainer>
      )}
    </St.Container>
  );
};

export default Carousel;
