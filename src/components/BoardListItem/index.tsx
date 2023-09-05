import { useNavigate } from 'react-router-dom';
import './style.css';
import { BoardListResponseDto } from 'src/interfaces/response/board';

import DefaultProfile2 from 'src/assets/default-profile-image.png'
import { dateFormat } from 'src/utils';

interface Props{
  item : BoardListResponseDto ;
}

export default function BoardListItem({item} : Props) {
 
  //!          state          //
  // description: 속성으로 받아오는 게시물 관련 상태 //
  const { boardNumber,title,contents, imageUrl, writerProfileImage,
    writerNickname,writeDatetime,commentCount,favoriteCount,viewCount } = 
    item;

  //!          function          //
  //! useNavigate() : 자바스크립트 로직중 페이지 이동을 시켜주는 훅 함수
  const navigator = useNavigate();

  //!          event handler          //
  // description: 컴포넌트 클릭 이벤트 //
  const onClickHandler = ()=>{
    navigator(`/board/detail/${boardNumber}`);
  }

  //!          render          //
  return (
    <div className='board-list-item-box' onClick={onClickHandler}>
      <div className="board-list-item-left">
        <div className="board-list-item-writer">
          <div className="board-list-item-profile">
            <div className="board-list-item-profile-image" 
                 style={{backgroundImage : !writerProfileImage ? `url(${DefaultProfile2})` : `url(${writerProfileImage})`}}>
            </div>
          </div>
          <div className="board-list-item-writer-right">
            <div className="board-list-item-writer-ninckname">
              {writerNickname}
            </div>
            <div className="board-list-item-write-date">
              {dateFormat(writeDatetime)}
            </div>
          </div>
        </div>
        <div className="board-list-item-title">
          {title}
        </div>
        <div className="board-list-item-content">
          {contents}
        </div>
        <div className="board-list-item-count">
          {`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}`}
        </div>
      </div>
      <div className="board-list-item-right">
        <div className="board-list-item-board-image" 
             style={{backgroundImage : `url(${imageUrl})`}}>
        </div>
        <div></div>
      </div>
    </div>
  )
}
