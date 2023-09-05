import { useState, useEffect, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import usePagination from 'src/hooks/pagination.hook';
import { useUserStore } from 'src/stores';
import CommentListItem from 'src/components/CommentListItem';
import Pagination from 'src/components/Pagination';
import { BOARD_UPDATE_PATH, COUNT_BY_PAGE_COMMNET, MAIN_PATH, USER_PAGE_PATH } from 'src/constants';
import './style.css';
import { deleteBoardRequest, getBoardRequest, getCommentListRequest, getFavoriteListRequest, postCommentRequest, putFavoriteRequest } from 'src/apis';
import { GetBoardResponseDto, GetCommentListResponseDto, GetFavoriteListResponseDto } from 'src/interfaces/response/board';
import ResponseDto from 'src/interfaces/response/response.dto';
import { FavoriteListResponseDto } from 'src/interfaces/response/board/get-favorite-list.response.dto';
import { CommentListResponseDto } from 'src/interfaces/response/board/get-comment-list.response.dto';
import { useCookies } from 'react-cookie';
import { PostCommentRequestDto } from 'src/interfaces/request/board';
import { dateFormat } from 'src/utils';

import DefaultProflie from 'src/assets/default-profile-image.png'

//!          component          //
//! description: 게시물 상세 화면 //
export default function BoardDetail() {
  //!          state          //
  // description: 게시물 번호 상태 //
  const { boardNumber } = useParams();
  // description:  //
  const { totalPage, currentPage, currentSection, onNextClickHandler, onPageClickHandler, onPreviousClickHandler, changeSection } = usePagination();
  // description: 로그인 유저 정보 상태 //
  const { user } = useUserStore();
  // 쿠키 상태 //
  const [cookie, setCookies] = useCookies();
  // description: 게시물 정보 상태 //
  const [board, setBoard] = useState<GetBoardResponseDto | null>(null);
  // description: 게시물 좋아요 회원 리스트 상태 //
  const [favoriteList, setFavoriteList] = useState<FavoriteListResponseDto[]>([]);
  // description: 댓글 리스트 상태 //
  const [commentList, setCommentList] = useState<CommentListResponseDto[]>([]);
  // description: 현재 페이지에서 보여줄 댓글 리스트 상태 //
  const [pageCommentList, setPageCommentList] = useState<CommentListResponseDto[]>([]);
  // description: 좋아요 리스트 컴포넌트 출력 상태 //
  const [showFavoriteList, setShowFavoriteList] = useState<boolean>(false);
  // description: 댓글 리스트 컴포넌트 출력 상태 //
  const [showCommentList, setShowCommentList] = useState<boolean>(false);
  
  //!          function          //
  // description: 페이지 이동을 위한 네비게이트 함수 //
  const navigator = useNavigate();
  // description: 현재 페이지의 댓글 리스트 분류 함수 //
  const getPageCommentList = (commentList : CommentListResponseDto[]) => {
    const lastIndex = commentList.length > COUNT_BY_PAGE_COMMNET * currentPage ?
    COUNT_BY_PAGE_COMMNET * currentPage : commentList.length;
    const startIndex = COUNT_BY_PAGE_COMMNET * (currentPage - 1);
    const pageCommentList = commentList.slice(startIndex, lastIndex);
    setPageCommentList(pageCommentList);
  }
  // 게시물 불러오기 요청 함수 //
  const getBoardResponseHandler = (responsebody : GetBoardResponseDto | ResponseDto ) => {
    const { code } = responsebody;

    if(code ==='NB') alert('존재하지않는 게시물입니다.');
    if(code ==='VF') alert('게시물 번호가 잘못되었습니다.');
    if(code ==='DE') alert('데이터베이스 에러');
    if(code !=='SU'){
      navigator(MAIN_PATH);
      return;
    }

    setBoard(responsebody as GetBoardResponseDto);
  }
  // 좋아요 리스트 불러오기 요청 함수 //
  const getFavoriteListResponseHandler = (responsebody : GetFavoriteListResponseDto | ResponseDto) => {
    const { code } = responsebody;

    if(code ==='VF') alert('게시물 번호가 잘못되었습니다.');
    if(code ==='DE') alert('데이터베이스 에러');
    if(code !=='SU') {
      setFavoriteList([]);
      return;
    }
    const { favoriteList } = responsebody as GetFavoriteListResponseDto;
    setFavoriteList(favoriteList);


  }
  // 댓글 리스트 불러오기 요청 함수 //
  const getCommentListResponseHandler = (responsebody : GetCommentListResponseDto | ResponseDto) => {
    const { code } = responsebody;

    if(code ==='VF') alert('게시물 번호가 잘못되었습니다.');
    if(code ==='DE') alert('데이터베이스 에러');
    if(code !=='SU') {
      setCommentList([]);
      return;
    }

    const { commentList } = responsebody as GetCommentListResponseDto;
    setCommentList(commentList);

    getPageCommentList(commentList);
    
    changeSection(commentList.length, COUNT_BY_PAGE_COMMNET);
  }

  //!          component          //
  //! description: 실제 게시물 컴포넌트 //
  const Board = () => {

  //!          state          //
  // more 버튼 클릭 상태
  const [openMore, setOpenMore] = useState<boolean>(false); 
  // 게시글 주인에 따른 more 버튼 표시 유무 상태
  const [viewMore, setViewMore] = useState<boolean>(false); 
  // favorite 상태
  const [favorite, setFavorite] = useState<boolean>(false); 


  //!          function          //
  // 좋아요 클릭 응답 처리 함수
  const putFavoriteResponseHandler = (code : string) => {
    if(code === 'NU') alert('존재하지않는 유저입니다.');
    if(code === 'NB') alert('존재하지않는 게시물입니다.');
    if(code === 'VF') alert('잘못된 입력입니다.');
    if(code === 'DE') alert('데이터베이스 에러');
    if(code !== 'SU') return;

    if(!boardNumber) return;
    getFavoriteListRequest(boardNumber).then(getFavoriteListResponseHandler);
  }
  // 게시물 삭제 응답 처리 함수
  const deleteBoardResponseHandler = (code : string) => {
    if(code === 'NU') alert('존재하지않는 유저입니다.');
    if(code === 'NB') alert('존재하지않는 게시물입니다.');
    if(code === 'NP') alert('권한이 없습니다.');
    if(code === 'VF') alert('잘못된 입력입니다.');
    if(code === 'DE') alert('데이터베이스 에러');
    if(code !== 'SU') return;

    alert('게시물 삭제 완료');
    navigator(MAIN_PATH);
  }
  //!          event handler          //
  // 작성자 닉네임 클릭 이벤트
  const onWriterNicknameClickHandler = () => {
    if (!board) return;
    navigator(USER_PAGE_PATH(board.writerEmail));
  }
  // more 버튼 클릭 이벤트
  const onMoreButtonClickHandler = () => {
    setOpenMore(!openMore);
  }
  // description: 수정 버튼 클릭 이벤트 //
  const onUpdateButtonClickHandler = () => {
    if (!board) return;
    navigator(BOARD_UPDATE_PATH(board.boardNumber));
  }
  // description: 삭제 버튼 클릭 이벤트 //
  const onDeleteButtonClickHandler = () => {
    if(!boardNumber) return;
    const token = cookie.accessToken;
    deleteBoardRequest(boardNumber, token).then(deleteBoardResponseHandler);
  }
  // 좋아요 리스트 펼치기 이벤트
  const onShowFavoriteButtonClickHandler = () => {
    setShowFavoriteList(!showFavoriteList);
  }

  // 좋아요 버튼 클릭 이벤트
  const onFavoriteButtonClickHandler = () => {
    if(!boardNumber) return;
    const token = cookie.accessToken;
    putFavoriteRequest(boardNumber,token).then(putFavoriteResponseHandler);
  }

  //댓글 리스트 펼치기 이벤트
  const onShowCommentButtonClickHandler = () => {
    setShowCommentList(!showCommentList);
  }

  //!           effect        //
  // 게시물 번호 혹은 로그인 유저 정보가 변경되면 실행
  useEffect(() => {
    setViewMore(user?.email === board?.writerEmail);
    const favorited = favoriteList.findIndex( (item) => item.Email === user?.email ) // 존재하면 true, 없으면 -1 반환
    setFavorite(favorited !== -1);
  }, [boardNumber, user]);

  // 좋아요 리스트가 변경되면 실행
  useEffect(() => {
    const favorited = favoriteList.findIndex( (item) => item.Email === user?.email ) // 존재하면 true, 없으면 -1 반환
    setFavorite(favorited !== -1);
  }, [favoriteList]);

  //!          rebder          //
    return (
      <div className='board-detail-container'>
        <div className='board-detail-top'>
          <div className='board-detail-title-container'>
            <div className='board-detail-title'>{board?.title}</div>
          </div>
          <div className='board-detail-meta-container'>
            <div className='board-detail-meta-left'>
              <div className='board-detail-writer-profile-image' style={{ backgroundImage :`url(${board?.writerProfileImage ? board?.writerProfileImage : DefaultProflie})` }}></div>
              <div className='board-detail-wrtier-nickname' onClick={onWriterNicknameClickHandler}>{board?.writerNickname}</div>
              <div className='board-detail-write-date'>{'\|'}</div>
              <div className='board-detail-write-date'>{dateFormat(board?.writeDatetime as string)}</div>
            </div>
            <div className='board-detail-meta-right'>
              {openMore && (
                <div className='more-button-group'>
                  <div className='more-button' onClick={onUpdateButtonClickHandler}>수정</div>
                  <div className='divider'></div>
                  <div className='more-button-red' onClick={onDeleteButtonClickHandler}>삭제</div>
                </div>
              )}
              {viewMore && (
                <div className='board-detail-more-button' onClick={onMoreButtonClickHandler}>
                  <div className='more-icon'></div>
                </div>
              )}
              
            </div>
          </div>
        </div>
        <div className='divider'></div>
        <div className='board-detail-middle'>
          <div className='board-detail-content'>{board?.contents}</div>
          <div className='board-detail-image-box'>
            <img className='board-detail-image' src={ board?.imageUrl ? board?.imageUrl : '' } />
          </div>
        </div>
        <div className='board-detail-bottom'>
          <div className='board-detail-bottom-item'>
            <div className='board-detail-bottom-button' onClick={onFavoriteButtonClickHandler}>
              { favorite ?  (
                <div className='favorite-fill-icon'></div>) : 
                (<div className='favorite-icon'></div> ) }
            </div>
            <div className='board-detail-bottom-text'>{favoriteList.length}</div>
            <div className='board-detail-bottom-button' onClick={onShowFavoriteButtonClickHandler}>
              { showFavoriteList ? (<div className='up-icon'></div>) : (<div className='down-icon'></div>) }
            </div>
          </div>
          <div className='board-detail-bottom-item'>
            <div className='board-detail-bottom-button'>
              <div className='comment-icon'></div>
            </div>
            <div className='board-detail-bottom-text'>댓글 {commentList.length}</div>
            <div className='board-detail-bottom-button' onClick={onShowCommentButtonClickHandler}>
              <div className='down-icon'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // description: 좋아요 리스트 컴포넌트 //
  const FavoriteList = () => {
    return (
      <div className='favorite-list-box'>
        <div className='favorite-list-title'>좋아요 <span className='favorite-list-title-emphasis'>{favoriteList.length}</span></div>
        <div className='favorite-list-container'>
          {favoriteList.map((item) => (
            <div className='favorite-list-item'>
              <div className='favorite-user-profile' style={{ backgroundImage: `url(${item.profileImageUrl})` }}></div>
              <div className='favorite-user-nickname'>{item.nickname}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  //! description: 댓글 컴포넌트 //
  const Comments = () => {

    //!           state         //
    const [comment, setComment] = useState<string>(''); 

    //!         function        //
    const postCommentResponseHandler = (code : string) => {
      if(code ==='NU') alert('존재하지않는 유저입니다.');
      if(code ==='NB') alert('존재하지않는 게시물입니다.');
      if(code ==='VF') alert('잘못된 입력입니다.');
      if(code ==='DE') alert('데이터베이스 에러');
      if(code !=='SU') return;

      if(!boardNumber) return;
      getCommentListRequest(boardNumber).then(getCommentListResponseHandler);
    }

    //!        event handler   //
    // 사용자 댓글 입력 이벤트
    const onCommentChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) => {
      setComment(event.target.value);
    }
    // 댓글 작성 버튼 클릭 이벤트
    const onCommentButtonClickHandler = () => {
      if(!boardNumber) return;
      const token = cookie.accessToken;
      const data : PostCommentRequestDto = {
        contents : comment
      }
      postCommentRequest(boardNumber, data, token).then(postCommentResponseHandler);
    }

    return (
      <div className='comment-list-box'>
        <div className="comment-list-top">
          <div className="commnet-list-title">댓글 <span className='comment-list-title-emphasis'>{commentList.length}</span></div>
          <div className="comment-list-container">
            { pageCommentList.map((item) => ( <CommentListItem item={item}/> ) ) }
          </div>
          <div className="divider"></div>
          { commentList.length !== 0 && 
            (
              <Pagination currentPage= {currentPage} 
                    totalPage={totalPage} 
                    onPreviousClickHandler={onPreviousClickHandler} 
                    onNextClickHandler={onNextClickHandler} 
                    onPageClickHandler={onPageClickHandler} /> 
            )
          } 
          
          <div className="comment-box">
            <textarea className='comment-textarea' rows={3} placeholder='댓글을 작성해주세요.' value={comment} onChange={(event) => {onCommentChangeHandler(event)}}></textarea>
            
            <div className="comment-button-box">
              { comment.length ? (<div className="black-button" onClick={onCommentButtonClickHandler}>댓글달기</div>) : (<div className="disable-button">댓글달기</div>) }
            </div>
          </div>

        </div>
      </div> 
    );
  }

  //!          effect          //
  // 보드 넘버가 바뀔 때마다 새로운 정보를 받아오는 작업
  useEffect(() => {
    if(!boardNumber){
      alert('게시물 번호가 잘못되었습니다.');
      navigator(MAIN_PATH);
      return;
    }
    
    getBoardRequest(boardNumber).then(getBoardResponseHandler);
    getFavoriteListRequest(boardNumber).then(getFavoriteListResponseHandler);
    getCommentListRequest(boardNumber).then(getCommentListResponseHandler);
  }, [boardNumber])

 // description: 현재 페이지가 바뀔때 마다 마이페이지 게시물 분류하기 //
 useEffect(() => {
  getPageCommentList(commentList);
  }, [currentPage]);

  // description: 현재 섹션이 바뀔때 마다 페이지 리스트 변경 //
  useEffect(() => {
    changeSection(commentList.length, COUNT_BY_PAGE_COMMNET);
  }, [currentSection]);
  
  //!          render          //
  return (
    <div id='board-detail-wrapper'>
      <Board />
      {showFavoriteList && (<FavoriteList />)}
      {showCommentList && (<Comments />)}
    </div>
  )
}