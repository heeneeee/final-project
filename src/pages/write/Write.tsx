import { useDeleteTempSave } from 'hooks/useDeleteTempSave';
import { useModal } from 'hooks/useModal';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { modalState } from 'recoil/modals';
import { initialPostInputState, postInputState } from 'recoil/posts';
import Editor from './components/editor/Editor';
import Hashtag from './components/hashtag/Hashtag';
import ImageUpload from './components/imageUpload/ImageUpload';
import Header from './components/writeHeader/WriteHeader';
import St from './style';

function Write() {
  const modal = useModal();
  const setIsModalOpen = useSetRecoilState(modalState);
  const onDeleteTempSave = useDeleteTempSave();

  const location = useLocation();
  const { foundDetailPost } = location.state || {};

  const [postInput, setPostInput] = useRecoilState(postInputState);
  //console.log(postInput.content);

  // 임시저장된 데이터 불러올지; 취소하면 날라가게
  useEffect(() => {
    // 700 밀리초 이후에 임시저장 알람 띄우기 (안그러면 글쓰기 누르자마자 알람이 생김)
    setTimeout(() => {
      const savedData = sessionStorage.getItem('savedData');
      if (savedData) {
        const onClickDelete = () => {
          setPostInput(initialPostInputState);
          // 임시저장된 데이터 삭제
          onDeleteTempSave();
          setIsModalOpen((prev) => ({ ...prev, isModalOpen06: false }));
          modal.close();
        };

        const onClickLoadSavedData = () => {
          setPostInput(JSON.parse(savedData));
          setIsModalOpen((prev) => ({ ...prev, isModalOpen06: false }));
          modal.close();
        };

        const openModalParams: Parameters<typeof modal.open>[0] = {
          title: '임시저장 데이터를 불러오시겠습니까?',
          message: '취소하면 데이터가 삭제됩니다.',
          leftButtonLabel: '취소',
          onClickLeftButton: onClickDelete,
          rightButtonLabel: '확인',
          onClickRightButton: onClickLoadSavedData
        };
        modal.open(openModalParams);
        setIsModalOpen((prev) => ({ ...prev, isModalOpen06: true }));
      }
    }, 700);
  }, []);

  // 새로고침 핸들러
  useEffect(() => {
    if (
      postInput.title === '' &&
      postInput.content === '' &&
      postInput.category === 'noCategory' &&
      postInput.hashtags.length === 0 &&
      postInput.coverImages.length === 0
    ) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = '');
    };

    // beforeunload 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
    };
  }, [postInput]);

  return (
    <St.Container>
      <Header foundDetailPost={foundDetailPost} />
      <Editor />
      <St.Spacer />
      <Hashtag />
      <ImageUpload />
    </St.Container>
  );
}

export default Write;
