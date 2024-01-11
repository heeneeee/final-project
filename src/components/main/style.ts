import { GoHeart, GoHeartFill } from 'react-icons/go';
import styled from 'styled-components';
import { SwiperSlide } from 'swiper/react';
import theme from '../../styles/theme';

const Container = styled.div`
  /* background-color: #fcad92;  */
  display: flex; //FullContainer의 속성을 조절해야 가운데로 올듯
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* max-width: 1440px; */
  width: 100%;
  /* height: 100%; */
`;

const AdminContentsSection = styled.section`
  background-color: #f5e1ab;
  position: relative;
  width: 100%;
  height: 350px;
  margin-bottom: 10px;
  & img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
const PrevNextBottons = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 87%; // gap말고 다른 스타일 속성 사용해야할듯
`;

const userPostsPosts = styled.section`
  /* background-color: #f5e1ab; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  margin-bottom: 10px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 15px;
  /* max-width: 1200px; */
  width: 100%;
  padding: 20px 0;
  /* margin-bottom: 10px; */

  & h1 {
    font-size: 38px;
    font-weight: 700;
  }
`;

const SubTitle = styled.div`
  display: flex;
  justify-content: space-between;

  & p {
    color: ${theme.color.mangoMain};
    font-size: 24px;
    font-weight: 700;
  }

  & button {
    color: ${theme.color.gray};
    background-color: transparent;
    border-color: transparent;
  }
`;

const PostsSlide = styled.div`
  /* background-color: aqua; */
  display: flex;
  align-items: center;
  width: 100%;
`;

const ThumbnailsBox = styled.div`
  display: flex;
  /* background-color: aquamarine; */
  justify-content: center;
  width: 100%;
  height: 300px;
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  display: flex;
  border-radius: 20px;
  width: 345px;
  height: 440px;
  overflow: hidden;
  background-color: lightblue;
  position: relative;
`;

const LikeButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const HeartIcon = styled(GoHeart)`
  background-color: blue;
  color: white;
  font-size: 26px;
  cursor: pointer;
`;

const HeartFillIcon = styled(GoHeartFill)`
  background-color: blue;
  color: red;
  font-size: 26px;
  cursor: pointer;
`;

const TopTenContainer = styled.div`
  width: 100%;
`;

export default {
  Container,
  AdminContentsSection,
  PrevNextBottons,
  userPostsPosts,
  TitleContainer,
  SubTitle,
  // Nav,
  PostsSlide,
  ThumbnailsBox,
  LikeButton,
  HeartIcon,
  HeartFillIcon,
  StyledSwiperSlide,
  TopTenContainer
};
