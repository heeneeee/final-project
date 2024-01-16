import { useEffect, useState } from 'react';
import { GoChevronDown } from 'react-icons/go';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import defaultImg from '../assets/defaultImg.jpg';
import { isSignUpState, roleState } from '../recoil/users';
import { auth } from '../shared/firebase';

type Props = {
  styledNav: ({ isActive }: { isActive: boolean }) => {
    color: string;
  };
  setIsAuthToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AuthNavBar({ styledNav, setIsAuthToggleOpen }: Props) {
  const [userInfo, setUserInfo] = useState(auth.currentUser);

  const [isSignUp, setIsSignUp] = useRecoilState(isSignUpState);
  const [role, setRole] = useRecoilState(roleState);

  const navigate = useNavigate();

  // 바뀔때마다 업데이트
  useEffect(() => {
    setUserInfo(auth.currentUser);
  }, [auth.currentUser]);

  const onAuthCheckHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (!auth.currentUser) {
      const confirmation = window.confirm('로그인이 필요합니다. 로그인 창으로 이동하시겠습니까?');
      if (confirmation) {
        navigate('/auth');
      } else return;
    } else navigate('/write');
  };

  return (
    <AuthContainer>
      {/* useEffect에 넣기 */}
      {/* {auth.currentUser ? '로그아웃' : '로그인'} */}
      <StyledNavLnk to="/write" onClick={onAuthCheckHandler} style={styledNav}>
        글쓰기
      </StyledNavLnk>
      {auth.currentUser ? (
        <>
          <UserInfo onClick={() => setIsAuthToggleOpen((prev) => !prev)}>
            <img src={auth.currentUser?.photoURL ?? defaultImg} alt="profile" />
            <span>{auth.currentUser?.displayName}</span>
            <span>
              <GoChevronDown />
            </span>
          </UserInfo>
        </>
      ) : (
        <>
          <StyledNavLnk to="/auth" onClick={() => setIsSignUp(false)} style={styledNav}>
            로그인
          </StyledNavLnk>
          <StyledNavLnk to="/auth" onClick={() => setIsSignUp(true)}>
            회원가입
          </StyledNavLnk>
        </>
      )}
    </AuthContainer>
  );
}

export default AuthNavBar;

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  color: #888;
  font-size: 14px;
`;

const StyledNavLnk = styled(NavLink)`
  font-weight: normal;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  color: black;
  font-weight: bold;
  cursor: pointer;

  & img {
    width: 25px;
    border-radius: 50%;
    object-fit: fill;
  }
  & button {
    display: flex;
    align-items: center;
    background-color: transparent;
    border-color: transparent;
    padding: 0;
  }
`;
