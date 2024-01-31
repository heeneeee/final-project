import { useQueryClient } from '@tanstack/react-query';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAdminPostList } from '../../api/pageListApi';
import logo from '../../assets/icons/mango-logo.png';
import AuthToggle from '../../components/auth/AuthToggle';
import useOutsideClick from '../../hooks/useOutsideClick';
import { QUERY_KEYS } from '../../query/keys';
import AuthNavBar from './AuthNavBar';
import St, { LogoContainer } from './style';

function NavBar() {
  const [isAuthToggleOpen, setIsAuthToggleOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  // hover 시 prefetch 함수!
  const queryClient = useQueryClient();
  const handleHover = async () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: [QUERY_KEYS.ADMIN],
      queryFn: getAdminPostList,
      initialPageParam: undefined as undefined | QueryDocumentSnapshot<DocumentData, DocumentData>,
      staleTime: 60000
    });
  };

  //반응형 웹 (로그인/회원가입시 : navbar 히든 / 나머지는 : 보여지기)
  const [isAuth, setIsAuth] = useState(false);
  console.log('isAuth', isAuth);
  useEffect(() => {
    const detailURL = window.location.href;
    const isAuthInURL = detailURL.includes('auth');
    setIsAuth(isAuthInURL);
  }, []);

  return isAuth ? (
    <St.NavContainer ref={navRef} isAuth={isAuth}>
      <St.NavBarContainer>
        <St.LeftNav>
          <LogoContainer onClick={() => navigate('/')} isAuth={isAuth}>
            <img src={logo} alt="logo" />
            <span>Mango</span>
          </LogoContainer>
          <NavLink to="/about" style={styledNav}>
            ABOUT
          </NavLink>
          <NavLink to="/mangoContents" style={styledNav} onMouseEnter={handleHover}>
            BY MANGO
          </NavLink>
          <NavLink to="/viewAll" style={styledNav} onMouseEnter={handleHover}>
            COMMUNITY
          </NavLink>
        </St.LeftNav>

        <AuthNavBar styledNav={styledNav} setIsAuthToggleOpen={setIsAuthToggleOpen} />
      </St.NavBarContainer>
      {isAuthToggleOpen && <AuthToggle setIsAuthToggleOpen={setIsAuthToggleOpen} />}
    </St.NavContainer>
  ) : (
    <St.NavContainer ref={navRef} isAuth={isAuth}>
      <St.NavBarContainer>
        <St.LeftNav>
          <LogoContainer onClick={() => navigate('/')} isAuth={isAuth}>
            <img src={logo} alt="logo" />
            <span>Mango</span>
          </LogoContainer>
          <NavLink to="/about" style={styledNav}>
            ABOUT
          </NavLink>
          <NavLink to="/mangoContents" style={styledNav} onMouseEnter={handleHover}>
            BY MANGO
          </NavLink>
          <NavLink to="/viewAll" style={styledNav} onMouseEnter={handleHover}>
            COMMUNITY
          </NavLink>
        </St.LeftNav>

        <AuthNavBar styledNav={styledNav} setIsAuthToggleOpen={setIsAuthToggleOpen} />
      </St.NavBarContainer>
      {isAuthToggleOpen && <AuthToggle setIsAuthToggleOpen={setIsAuthToggleOpen} />}
    </St.NavContainer>
  );
}

export default NavBar;
