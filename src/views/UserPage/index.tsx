import {useRef,ChangeEvent, useState,useEffect} from 'react'
import { useNavigate, useParams} from 'react-router-dom';
import { useUserStore } from 'src/stores';
import usePagination from 'src/hooks/pagination.hook';
import Pagination from 'src/components/Pagination';
import BoardListItem from 'src/components/BoardListItem';
import { myPageListMock } from 'src/mocks';
import { AUTH_PATH, BOARD_WRITE_PATH, COUNT_BY_PAGE, MAIN_PATH, USER_PAGE_PATH } from 'src/constants';
import DefaultProflie from './asset/my_page_profile_default.png';
import './style.css';
import { getUserBoardListRequest, getUserRequest, patchUserNicknameRequest, patchUserProfileRequest, uploadFileRequest } from 'src/apis';
import { GetUserResponseDto } from 'src/interfaces/response/user';
import ResponseDto from 'src/interfaces/response/response.dto';
import { BoardListResponseDto, GetUserListResponseDto } from 'src/interfaces/response/board';
import { useCookies } from 'react-cookie';
import { PatchBoardRequestDto } from 'src/interfaces/request/board';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from 'src/interfaces/request/user';
export default function UserPage() {
  //! state //
  // 유저 이메일 상태
  const { userEmail } = useParams();
  // 로그인한 사용자의 정보 상태
  const {user, setUser} = useUserStore();
  // 쿠키 상태 //
  const [cookies, setCookie] = useCookies();
  // 마이페이지 여부 상태
  const [myPage, setMyPage] = useState<boolean>(false);

  //! function //
  const navigator = useNavigate();

  //!       component         //
  //! 마이페이지 상단
  const MyPageTop = () => {

  //! STATE  //
  // description: input 요소에 대한 참조용 상태 //
  // description: useRef를 사용하여 HTML 요소를 JS 객체로 다룰수 있음 //
  const fileInputRef = useRef<HTMLInputElement>(null);
  // description: 사용자 프로필 사진 URL 상태 //
  const [profileImageUrl, setProfileImageUrl] = useState<string>(DefaultProflie);
  // description: 사용자 닉네임 상태 //
  const [nickname, setNickname] = useState<string>('');
  // 닉네임 변경 버튼 상태
  const [nicknameChange, setNicknameChange] = useState<boolean>(false);
  
  //!     function    //
  // 유저 정보 불러오기 응답 처리 함수
  const getUserResponseHandler = (result : GetUserResponseDto | ResponseDto) => {
    const { code } = result;
    if(code === 'NU') alert('존재하지 않는 유저');
    if(code === 'VF') alert('입력이 올바르지 않습니다.');
    if(code === 'DE') alert('데이터베이스 에러');
    if(code !== 'SU'){
      navigator(MAIN_PATH);
      return;
    } 

    const { nickname, profileImageUrl } = result as GetUserResponseDto;
    setNickname(nickname);
    if(profileImageUrl) setProfileImageUrl(profileImageUrl);
    else setProfileImageUrl(DefaultProflie);

    if (userEmail === user?.email){
      const after = { email:userEmail as string, nickname, profileImageUrl }
      setUser(after);
    }
    
  }
  // 닉네임 변경 응답 처리 함수 //
  const patchNicnameResponseHandler = (code : string) => {
    if(!user) return;
    if(code === 'NU') alert('존재하지 않는 유저');
    if(code === 'EN') alert('중복되는 닉네임입니다.');
    if(code === 'VF') alert('입력이 올바르지 않습니다.');
    if(code === 'DE') alert('데이터베이스 에러');
    if(code !== 'SU'){
      setNickname(user?.nickname as string);
      return;
    }

    getUserRequest(user.email).then(getUserResponseHandler);
  }
  // 파일 업로드 응답 처리 함수 //
  const profileUploadResponseHandler = (url : string | null) => {
    if(!user) return;
    if(!url) {
      setProfileImageUrl(user?.profileImageUrl as string);
      return;
    }
    // 프로필 이미지 변경 리퀘스트 및 응답
    const data : PatchProfileImageRequestDto = {
      profileImage : url
    }
    const token = cookies.accessToken;
    patchUserProfileRequest(data, token).then(patchProfileImageResponseHandler);
  }
  // 유저 프로필 이미지 변경 응답 처리 함수 //
  const patchProfileImageResponseHandler = (code : string ) => {
    if(!user) return;
    if(code === 'NU') alert('존재하지않는 유저입니다.');
    if(code === 'EN') alert('중복되는 닉네임입니다.');
    if(code === 'VF') alert('입력이 올바르지 않습니다.');
    if(code === 'DE') alert('데이터베이스 에러');
    if(code !== 'SU'){
      setProfileImageUrl(user?.profileImageUrl as string);
      return;
    }

    getUserRequest(user.email).then(getUserResponseHandler);
  }


  //! EVENT HANDLER //
  // 프로필이미지를 누를시, 파일인풋타입 파일선택을 누른것처럼 만드는 효과
  const onProfileClickHandler = () => {
    if(userEmail !== user?.email) return;
    fileInputRef.current?.click();
  }
  // 파일 인풋 변경 시 이미지 미리보기
  const onImageInputChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
    // 파일이 없을때, 파일이 있긴하지만 길이가 0일때 종료
    if(!event.target.files || !event.target.files.length) return;

    // 파일 업로드 요청 및 응답
    const data = new FormData();
    data.append('file', event.target.files[0]);
    uploadFileRequest(data).then(profileUploadResponseHandler);

    // description: 입력받은 이미지 파일을 URL 형태로 변경해주는 구문 //
    const imageUrl = URL.createObjectURL(event.target.files[0]); // todo
    setProfileImageUrl(imageUrl);
  }
  // 닉네임 변경 이벤트
  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => { // todo
    // setNickname(event.target.value);
    const token = cookies.accessToken;
    const data : PatchNicknameRequestDto = {
      nickname : event.target.value
    }
    patchUserNicknameRequest(data, token).then(patchNicnameResponseHandler)
  }
  // description: 닉네임 변경 버튼 클릭 이벤트 // todo
  const onNicknameButtonClickHandler = () => {
    setNicknameChange(!nicknameChange);
  }
  
  //!     effect    //
  // 유저 이메일 상태가 바뀔 때마다 실행
  useEffect(() => {
    if(!userEmail){
      navigator(MAIN_PATH);
      return;
    } 
    
    // 내 페이지면 프로필정보를 나의 프로필과 나의 닉네임으로 세팅
    const isMyPage = user?.email === userEmail;
    if(isMyPage){
      if (user?.profileImageUrl) setProfileImageUrl(user?.profileImageUrl);
      else setProfileImageUrl(DefaultProflie);
      
      setNickname(user?.nickname as string);
    } else{
      getUserRequest(userEmail as string).then(getUserResponseHandler); 
    }

  }, [userEmail]);

  //!     render    //
  return (
    <div className='my-page-top'>
        <div className='my-page-top-container'>
          <div className='my-page-top-profile-box'>
            <div className='my-page-top-profile' style={{ backgroundImage: `url(${profileImageUrl})` }} onClick={onProfileClickHandler}></div>
            <input type='file' style={{ display: 'none' }} ref={fileInputRef} accept='image/*' onChange={onImageInputChangeHandler} />
          </div>
          <div className='my-page-top-info-box'>
            <div className='my-page-info-nickname-container'>
              {nicknameChange ? (
                <input className='my-page-info-nickname-input' type='text' value={nickname} onChange={onNicknameChangeHandler} 
                size={nickname.length} />
                ) : 
                (<div className='my-page-info-nickname'>{nickname}</div>)
              }
              { myPage && 
                ( <div className='my-page-info-nickname-button' onClick={onNicknameButtonClickHandler}>
                  <div className='my-page-edit-icon'></div>
                  </div> ) 
              }
              
            </div>
            <div className='my-page-info-email'>{userEmail}</div>
          </div>
        </div>
      </div>
  );
  }

  // 마이페이지 하단
  const MyPageBottom = () => {
    //! state //
    const { totalPage, currentPage, currentSection, onPageClickHandler, onNextClickHandler, onPreviousClickHandler, changeSection } = usePagination();  
    const [myPageBoardList, setMyPageBoardList] = useState<BoardListResponseDto[]>([]);
    const [boardCount, setBoardCount] = useState<number>(0);
    // description: 현재 페이지에서 보여줄 게시물 리스트 상태 //
    const [pageBoardList, setPageBoardList] = useState<BoardListResponseDto[]>([]);

    //! function //
    const getPageBoardList = (boardList : BoardListResponseDto[]) => {
      const lastIndex = 
        boardList.length > COUNT_BY_PAGE * currentPage ? 
        COUNT_BY_PAGE * currentPage : boardList.length;
      const startIndex = COUNT_BY_PAGE * (currentPage - 1);
      const pageBoardList = boardList.slice(startIndex, lastIndex);
  
      setPageBoardList(pageBoardList);
    }
    // 유저 작성 게시물 리스트 불러오기 응답 처리 함수 //
    const getUserBoardListResponseHandler = (responsebody : GetUserListResponseDto | ResponseDto) => {
      const { code } = responsebody;
      if(code === 'VF') alert('입력이 올바르지 않습니다.');
      if(code === 'DE') alert('데이터베이스 에러');
      if(code !== 'SU') return;

      const { boardList } = responsebody as GetUserListResponseDto;
      setMyPageBoardList(boardList);
      setBoardCount(boardList.length);
      getPageBoardList(boardList);
      changeSection(boardList.length, COUNT_BY_PAGE);
    }


    //!          event handler          //
    // 글쓰기 클릭 이벤트
    const onWriteButtonClickHandler = () => {
      navigator(BOARD_WRITE_PATH());
    }
    // 내 게시물로 가기 클릭 이벤트
    const onMoveMyPageButtonClickHandler = () => {
      if(!user){
        alert(`로그인이 필요합니다.`);
        navigator(AUTH_PATH);
        return;
      }
      if (!userEmail) return;
      navigator(USER_PAGE_PATH(userEmail));
    }


    //!          effect          //
    // description: 화면 첫 로드시 게시물 리스트 불러오기 //
    useEffect(() => {
      if(!userEmail) {
        alert('잘못된 사용자 이메일입니다.');
        navigator(MAIN_PATH);
        return;
      }
      getUserBoardListRequest(userEmail).then(getUserBoardListResponseHandler);
    }, []);

    // description: 현재 페이지가 바뀔때 마다 마이페이지 게시물 분류하기 //
    useEffect(() => {
      getPageBoardList(myPageBoardList);
    }, [currentPage]);

    // description: 현재 섹션이 바뀔때 마다 페이지 리스트 변경 //
    useEffect(() => {
      if(boardCount) changeSection(boardCount, COUNT_BY_PAGE);
    }, [currentSection]);


    //! render
    return (
      <div className="my-page-bottom">
        <div className="my-page-bottom-text">
          {myPage? '내 게시물 ' : '게시물 '}<span className='my-page-bottom-text-emphasis'>{boardCount}</span>
        </div>
        <div className="my-page-bottom-container">
          {boardCount ? (
            <div className='my-page-bottom-board-list'>
              {pageBoardList.map((item) => (<BoardListItem item={item} />))}
            </div>
          ) : (
            <div className='my-page-bottom-board-list-nothing'>게시물이 없습니다.</div>
          )}
          <div className="my-page-bottom-write-box">
              { user?.email === userEmail ? 
                ( 
                  <div className="my-page-bottom-write-button" onClick={onWriteButtonClickHandler}>
                    <div className="my-page-edit-icon"></div>
                    <div className="my-page-bottom-write-button-text">글쓰기</div>
                  </div>
                ) 
                : 
                ( 
                  <div className="my-page-bottom-write-button" onClick={onMoveMyPageButtonClickHandler}>
                    <div className='my-page-bottom-write-button-text'>내 게시물로 가기 {'\→'}</div>
                  </div>
                ) 
              }
          </div>
        </div>  

        {boardCount !== 0 && 
          (<Pagination currentPage= {currentPage} 
                      totalPage={totalPage} 
                      onPreviousClickHandler={onPreviousClickHandler} 
                      onNextClickHandler={onNextClickHandler} 
                      onPageClickHandler={onPageClickHandler} />) 
        }
      </div>
    );
  }

  //! effect //
  // 유저 이메일 상태가 바뀔 때마다 실행
  useEffect(() => {
    // 유저이메일이 빈값이거나 언디파인이라면 main 페이지로 돌려보냄
    if ( !userEmail ){
      navigator(MAIN_PATH);
      return;
    } 
    const isMyPage = user?.email === userEmail;
    setMyPage(isMyPage)
  }, [userEmail, user]);

  //        render          //
  return (
    <div id='my-page-wrapper'>
      <MyPageTop />
      <MyPageBottom />
    </div>
  )
}
