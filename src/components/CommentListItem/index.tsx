
import { CommentListResponseDto } from 'src/interfaces/response/board/get-comment-list.response.dto';
import './style.css';

import DefaultProfile2 from 'src/assets/default-profile-image.png'
interface Porps{
  item : CommentListResponseDto;
}
//!          component          //
// description: 댓글 리스트 아이템 컴포넌트 //
export default function CommentListItem(props : Porps) {

  //!          state          //
  // description: 속성으로 받아오는 댓글 관련 상태 //
  const {profileImageUrl,nickname,writeDateTime,contents} = props.item;
  
  const getTimeGap = () => {
    const writeDate = new Date(writeDateTime)
    writeDate.setHours(writeDate.getHours() - 9);

    const writeDateNumber = writeDate.getTime();
    const nowDateNumber = new Date().getTime();

    const gap = Math.floor((nowDateNumber - writeDateNumber) / 1000); // 이게 지금 초, 1분미만건 초로, 1분이상은 분전, 1시간 이후부턴 시간전, 하루 이상부턴 일전
    
    let result = '';
    
    if(gap < 60) result = `${gap}초 전`;
    else if(gap < 3600) result = `${Math.floor(gap / 60)}분 전`;
    else if(gap < 86400) result = `${Math.floor(gap / 3600)}시간 전`;
    else result = `${Math.floor(gap / 86400)}일 전`;
    
    return result;
  }

  //!          render          //
  return (
    <div className='comment-list-item-box'>
      <div className="comment-list-item-writer">
        <div className="comment-list-item-profile">
          <div className="comment-list-item-profile-image"
                style={{backgroundImage : `url(${profileImageUrl ? profileImageUrl : DefaultProfile2})`}}>
          </div>
        </div>
        <div className="comment-list-item-writer-ninckname">
          {nickname}
        </div>
        <div className="comment-list-item-writer-divider">|</div>
        <div className="comment-list-item-write-time">
          { getTimeGap() }
        </div>
      </div>
      <div className="comment-list-item-comment">
        {contents}
      </div>
    </div>
  )
}
