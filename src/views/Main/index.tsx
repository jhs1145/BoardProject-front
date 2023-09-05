import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import usePagination from 'src/hooks/pagination.hook';
import Top3ListItem from 'src/components/Top3ListItem';
import BoardListItem from 'src/components/BoardListItem';
import Pagination from 'src/components/Pagination';
import { currentBoardListMock, popularWordListMock, top3ListMock } from 'src/mocks';
import { COUNT_BY_PAGE, SEARCH_PATH } from 'src/constants';
import './style.css';
import { getCurrentBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from 'src/apis';
import { GetPopularListResponseDto } from 'src/interfaces/response/search';
import ResponseDto from 'src/interfaces/response/response.dto';
import { BoardListResponseDto, GetCurrentBoardResponseDto, GetTop3ResponseDto } from 'src/interfaces/response/board';
//!          component          //
// description: 메인 화면 컴포넌트 //
export default function Main() {

  //!          function          //
  // description: 페이지 이동을 위한 네비게이트 함수 //
  const navigator = useNavigate();

  //!          component          //
  // description: 메인 화면의 상단 //
  const MainTop = () => {
    
    //!          state          //
    // description: 인기 게시물 리스트 상태 //
    const [top3List, setTop3List] = useState<BoardListResponseDto[]>([]);

    //!          function         //
    const getTop3BoardListResponseHandler = (responsebody : GetTop3ResponseDto | ResponseDto) => {
      const { code } = responsebody;
      if(code === 'DE') alert('데이터베이스 에러');
      if(code !== 'SU') return;
      
      const { top3 } = responsebody as GetTop3ResponseDto;
      setTop3List(top3);
    }

    //!          effect          //
    // description: 첫 시작 시 TOP3 게시물 데이터 불러오기 //
    useEffect(() => {
      getTop3BoardListRequest().then(getTop3BoardListResponseHandler);
    }, []);
    
    //!         render        //
    return(
      <div className="main-top">
        <div className="main-top-text-container">
          <div className="main-top-text"><span className='this'>THIS BOARD</span>에서</div>
          <div className="main-top-text">다양한 이야기를 나눠보세요.</div>
        </div>
        <div className="main-top-3-container">
          <div className="main-top-3-text">주간 TOP 3 게시글</div>
          <div className="main-top-3-list">
            {top3List.map((item) => (<Top3ListItem item={item}/>))}
          </div>
        </div>
      </div>
    )
    
  }
  const MainBottom = () => {
    //!          state          //
    // description: 페이지네이션 관련 상태 및 함수 //
    const { totalPage, currentPage, currentSection, onPageClickHandler, onNextClickHandler, onPreviousClickHandler, changeSection } = usePagination();
    // description: 최신 게시물 리스트 상태 //
    const [currentList, setCurrentList] = useState<BoardListResponseDto[]>([]);
    // description: 인기 검색어 리스트 상태 //
    const [popularList, setPopularList] = useState<string[]>([]);
    // description: 현재 페이지에서 보여줄 게시물 리스트 상태 //
    const [pageBoardList, setPageBoardList] = useState<BoardListResponseDto[]>([]);
    
    //!         function          //
    // description: 현재 페이지의 게시물 리스트 분류 함수 //
  const getPageBoardList = (boardList : BoardListResponseDto[]) => {
    const lastIndex = 
    boardList.length > COUNT_BY_PAGE * currentPage ? 
      COUNT_BY_PAGE * currentPage : boardList.length;
    const startIndex = COUNT_BY_PAGE * (currentPage - 1);
    const pageBoardList = boardList.slice(startIndex, lastIndex);

    setPageBoardList(pageBoardList);
  }

    // description: 인기 검색어 불러오기 응답 처리 함수 // 
    const getPopularListResponseHandler = (responsebody : GetPopularListResponseDto | ResponseDto) => {
      const { code } = responsebody;
      if(code === 'VF') alert('입력이 올바르지 않습니다.');
      if(code === 'DE') alert('데이터베이스 에러');
      if(code !== 'SU') return;
      
      const { popularList } = responsebody as GetPopularListResponseDto;
      setPopularList(popularList);
    }

    // 최신 게시물 리스트 불러오기 응답 처리 함수 //
    const getCurrentBoardListResponseHandler = (responsebody : GetCurrentBoardResponseDto | ResponseDto) => {
      const { code } = responsebody;
      if(code === 'VF') alert('잘못된 섹션');
      if(code === 'DE') alert('데이터베이스 에러');
      if(code !== 'SU') return;
      
      const { boardList } = responsebody as GetCurrentBoardResponseDto;
      
      changeSection(boardList.length, COUNT_BY_PAGE);
      setCurrentList(boardList);
      getPageBoardList(boardList);
    }


    //!       event handler         //
     // description: 인기 검색어 클릭 이벤트 //
    const onPopularClickHandler = (word:string) => {
      navigator(SEARCH_PATH(word));
    }

    //!          effect          //
    // description: 첫 시작 시 인기 검색어 리스트 불러오기 //
    useEffect(() => {
      getPopularListRequest().then(getPopularListResponseHandler);
    }, []);
    // description: 현재 섹션이 바뀔 때마다 페이지 리스트 변경 및 최신 게시물 불러오기 //
    useEffect(() => {
      getCurrentBoardListRequest(currentSection).then(getCurrentBoardListResponseHandler);
    }, [currentSection]);
    // description: 현재 페이지가 바뀔때 마다 검색 게시물 분류하기 //
    useEffect(() => {
      getPageBoardList(currentList); // todo 확인
    }, [currentPage]);

    //!         render        //
    return(    
      <div className="main-bottom">
        <div className="main-bottom-text">최신 게시물</div>
        <div className="main-bottom-container">
          <div className="main-bottom-board-list">
          {pageBoardList.map((item) => (<BoardListItem item={item}/>))}
          </div>
          <div className="main-bottom-popular-box">
            <div className="main-bottom-popular-card">
              <div className="main-bottom-popular-text">인기 검색어</div>
              <div className="main-bottom-popular-list">
                {popularList.map((item) => 
                  ( <span className='popular-chip' onClick={() => {onPopularClickHandler(item)}}>
                    {item}
                    </span>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        <Pagination 
          totalPage={totalPage} 
          currentPage={currentPage} 
          onPageClickHandler={onPageClickHandler} 
          onNextClickHandler={onNextClickHandler} 
          onPreviousClickHandler={onPreviousClickHandler} 
        />
      </div>
    )
  }
  return (
    <div id='main-wrapper'>
      <MainTop />
      <MainBottom />
    </div>
  )
}
