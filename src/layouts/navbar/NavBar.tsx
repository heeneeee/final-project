import { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/mango-logo.png';
import AuthToggle from '../../components/auth/AuthToggle';
import useOutsideClick from '../../hooks/useOutsideClick';
import usePreviousPathname from '../../util/usePreviousPathname';
import AuthNavBar from './AuthNavBar';
import St, { LogoContainer } from './style';
import { useQueryClient } from '@tanstack/react-query';
import { getAdminPosts } from '../../api/homeApi';
import { getAdminPostList, getCategoryPosts } from '../../api/pageListApi';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { QUERY_KEYS } from '../../query/keys';
import { getAllUsers } from '../../api/authApi';

function NavBar() {
  const [isAuthToggleOpen, setIsAuthToggleOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const prevPathName = usePreviousPathname();

  // AuthToggle 밖 누르면 꺼지게
  useOutsideClick<HTMLDivElement>(navRef, () => {
    if (isAuthToggleOpen) {
      setIsAuthToggleOpen(false);
    }
  });

  // 선택되면 노란색으로 NavBar 이름 스타일 바뀌게
  const styledNav = ({ isActive }: { isActive: boolean }) => {
    return { color: isActive ? '#FFA114' : '' };
  };

  // hover 시 prefetch 함수
  const queryClient = useQueryClient(); // queryClient 사용

  //잘작동 (admin 한정)
  // const handleHover = async () => {
  //   queryClient.prefetchInfiniteQuery({
  //     queryKey: [QUERY_KEYS.ADMIN],
  //     queryFn: getAdminPostList,
  //     initialPageParam: undefined as undefined | QueryDocumentSnapshot<DocumentData, DocumentData>,
  //     staleTime: 60000
  //   });
  // };

  const handleHover = async () => {
    const queriesToPrefetch = [
      { queryKey: QUERY_KEYS.ADMIN, queryFn: getAdminPostList },
      { queryKey: QUERY_KEYS.KNOWHOW, queryFn: getCategoryPosts('knowHow') },
      { queryKey: QUERY_KEYS.RECOMMEND, queryFn: getCategoryPosts('recommendation') },
      { queryKey: QUERY_KEYS.SHARE, queryFn: getCategoryPosts('sharing') },
      { queryKey: QUERY_KEYS.HABIT, queryFn: getCategoryPosts('habit') },
      { queryKey: QUERY_KEYS.TOTAL, queryFn: getCategoryPosts('total') },
      { queryKey: QUERY_KEYS.NOCATEGORY, queryFn: getCategoryPosts('noCategory') }

      // 다른 queryKey와 queryFn을 추가할 수 있습니다.
    ];

    for (const { queryKey, queryFn } of queriesToPrefetch) {
      await queryClient.prefetchInfiniteQuery({
        queryKey: [queryKey],
        queryFn: queryFn,
        initialPageParam: undefined as undefined | QueryDocumentSnapshot<DocumentData, DocumentData>,
        staleTime: 60000
      });
    }
  };

  // useEffect(() => {
  //   if (prevPathName === '/write') {
  //     window.location.reload();
  //   }
  // }, [prevPathName]);

  return (
    <St.NavContainer ref={navRef}>
      <St.NavBarContainer>
        <St.LeftNav>
          <LogoContainer onClick={() => navigate('/')}>
            <img src={logo} alt="logo" />
            <span>Mango</span>
          </LogoContainer>
          <NavLink to="/about" style={styledNav}>
            망고 소개
          </NavLink>

          <NavLink to="/viewAll" style={styledNav} onMouseEnter={handleHover}>
            게시물 보기
          </NavLink>
        </St.LeftNav>
        <AuthNavBar styledNav={styledNav} setIsAuthToggleOpen={setIsAuthToggleOpen} />
      </St.NavBarContainer>
      {isAuthToggleOpen && <AuthToggle setIsAuthToggleOpen={setIsAuthToggleOpen} />}
    </St.NavContainer>
  );
}

export default NavBar;
