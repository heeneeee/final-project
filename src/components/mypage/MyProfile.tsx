import { useQuery } from '@tanstack/react-query';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { GoCalendar, GoHeart, GoTasklist } from 'react-icons/go';
import { getMyPosts } from '../../api/myPostAPI';
import defaultImg from '../../assets/defaultImg.jpg';
import { QUERY_KEYS } from '../../query/keys';
import { auth, db, storage } from '../../shared/firebase';
import HabitCalendar from './HabitCalendar';
import LikesPosts from './LikesPosts';
import MyPosts from './MyPosts';
import St from './style';
import { CiSettings } from 'react-icons/ci';
import { displayName } from 'react-quill';

function MyProfile() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [newDisplayName, setNewDisPlayName] = useState('');
  const [userObj, setUserObj] = useState({});
  const [imageUpload, setImageUpload] = useState<any>('');
  const [image, setImage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // const [editingTest, setEditingText] = useState('');

  const onClickTabBtn = (name: string) => {
    setActiveTab(name);
  };

  const onChangeDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisPlayName(e.target.value);
  };

  // 커스텀훅--> 구현 하고나서!!!!!!!!!!!!!  addeventListener , 한 번만 실행해도 됨 if else --> 로그아웃

  // 내 게시물 갯수 가져오기
  const { data: posts } = useQuery({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: getMyPosts
  });

  //프로필 수정 업데이트
  const onSubmitModifyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // auth 불러오기
    const auth = getAuth();
    // 현재 유저 닉네임과 새로운 닉네임이 같지 않거나 현재 유저 사진Url과 업로드이미지가 같지 않으면!
    if (auth.currentUser?.displayName !== newDisplayName || auth.currentUser?.photoURL !== image) {
      // 현재 유저 uid 변수로 저장
      const userUid = auth.currentUser?.uid;
      if (userUid) {
        //  auth 객체에 있는 정보 업데이트
        await updateProfile(auth.currentUser!, {
          displayName: newDisplayName,
          photoURL: image
        });
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserObj({
              displayName: user.displayName,
              uid: user.uid,
              photoURL: user.photoURL
            });
            setNewDisPlayName(user.displayName || '');
          }
        });

        // getDoc으로 userDocRef users의 해당하는 현재 유저 uid를 가져온다
        const userDocRef = doc(db, 'users', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        const updateUser = auth.currentUser;
        // userDocRef users의 해당하는 현재 유저 uid가 있다면
        if (userDocSnapshot) {
          // 컬렉션에 있는 users 필드 정보 수정
          await updateDoc(userDocRef, {
            displayName: updateUser?.displayName,
            profileImg: updateUser?.photoURL,
            uid: updateUser?.uid,
            role: 'user'
          });
        }
        setNewDisPlayName(auth.currentUser?.displayName!);
        setIsEditing(false);
      }
    }
  };

  //div를 클릭해도 input이 클릭되도록 하기
  // const onClickUpload = () => {
  //   fileRef.current?.click();
  // };

  //input을 클릭해서 파일 업로드
  //사진 미리보기
  const onChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile?.size! > 1024 * 1024) {
      return alert('최대 1MB까지 업로드 가능합니다');
    }

    if (uploadedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };

      reader.readAsDataURL(uploadedFile);
      setImageUpload(uploadedFile);
    }
  };

  // 파일이 업로드되면 스토리지에 업로드하고 다운 즉시 이미지가 보여짐
  // 폴더/파일
  useEffect(() => {
    const imageRef = ref(storage, 'userProfile/' + `${auth.currentUser?.uid}`);
    if (!imageUpload) return;
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImage(url);
      });
    });
  }, [imageUpload]);

  return (
    <St.Wrapper>
      <St.ProfileEditWrapper>
<<<<<<< HEAD
        {/* <St.UserInfo> */}
        {/* <St.MyImage src={auth.currentUser?.photoURL! || defaultImg} alt="defaultImg" /> */}
        <St.profileImg src={auth.currentUser?.photoURL || defaultImg} alt="img" />
=======
        <St.MyImage src={previewImage || auth.currentUser?.photoURL!} alt="defaultImg" />
>>>>>>> 7c2ea7ef72174b433cdcedae5872cb2e656787c3
        <St.EmailAndName></St.EmailAndName>
        <St.ProfileInfo>
          {isEditing ? (
            <St.DisplayNameModify autoFocus defaultValue={newDisplayName} onChange={onChangeDisplayName} />
          ) : (
            <St.MyNickname>{auth.currentUser?.displayName}</St.MyNickname>
          )}
          <St.MyEmail>{auth.currentUser?.email}</St.MyEmail>
          <St.UserPostInfo>
            <span>게시물: {posts?.length}</span>
            <span>등급: Lv.0</span>
          </St.UserPostInfo>
          <St.UserInfoModify>
            {/* <St.FileInput style={{ border: '1px solid black' }} type="file" onChange={onChangeUpload} />
            <St.FileImgUpload onClick={onClickUpload}>업로드</St.FileImgUpload> */}
            <br />
            {/* <St.DisplayNameModify type="text" value={newDisplayName} onChange={onChangeDisplayName} /> */}
            {/* <St.EditBtn onClick={onSubmitModifyProfile}>수정하기</St.EditBtn> */}
          </St.UserInfoModify>
          <St.ModifyBox>
            {isEditing ? (
              <>
                <St.FileInput
                  style={{ border: '1px solid black' }}
                  type="file"
                  onChange={onChangeUpload}
                  accept="image/*"
                />
                {/* <St.FileImgUpload onClick={onClickUpload}>업로드</St.FileImgUpload> */}
                <St.ModifyButton onClick={() => setIsEditing(false)}>취소</St.ModifyButton>
                <St.ModifyButton
                  onClick={onSubmitModifyProfile}
                  disabled={!newDisplayName && image === auth.currentUser?.photoURL}
                >
                  수정완료
                </St.ModifyButton>
              </>
            ) : (
              <CiSettings onClick={() => setIsEditing(true)}>수정</CiSettings>
            )}
          </St.ModifyBox>
        </St.ProfileInfo>
      </St.ProfileEditWrapper>
      <St.MySectionWrapper>
        <St.TabButtonContainer>
          <St.TabButton
            onClick={() => {
              onClickTabBtn('calendar');
            }}
          >
            <div>
              <GoCalendar />
              캘린더
            </div>
          </St.TabButton>
          <St.TabButton
            onClick={() => {
              onClickTabBtn('myPosts');
            }}
          >
            <div>
              <GoTasklist />내 게시물
            </div>
          </St.TabButton>
          <St.TabButton
            onClick={() => {
              onClickTabBtn('likes');
            }}
          >
            <div>
              <GoHeart /> 좋아요
            </div>
          </St.TabButton>
        </St.TabButtonContainer>
        <St.Tabs>
          {activeTab === 'calendar' && <HabitCalendar />}
          {activeTab === 'myPosts' && <MyPosts />}
          {activeTab === 'likes' && <LikesPosts />}
        </St.Tabs>
      </St.MySectionWrapper>
    </St.Wrapper>
  );
}

export default MyProfile;
