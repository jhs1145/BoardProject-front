import { Dispatch, SetStateAction } from 'react'
import { INPUT_ICON } from 'src/constants';
import './style.css';

interface Props {
  label : string;
  type : string;
  placeholder : string;
  value : string;
  helper? : string;
  icon? : INPUT_ICON;
  error? : boolean;
  setValue: Dispatch<SetStateAction<string>>;
  buttonHandler? : () => void;
}

//!          component          //
// description: 인풋 상자 컴포넌트 //
export default function InputBox(props:Props) {
  
  //!          event handler          //
  // description: 입력값 변경 이벤트 //
  const onChangeHandler = (value:string) => {
    props.setValue(value);
  }

  return (
    <div className='input-box'>
      <div className="input-box-label">{props.label}</div>
      {/* 에러 유무에 따라 클래스를 바꾸기 */}
      <div className={ props.error ? 'input-box-container-error' : 'input-box-container'}>
        <input className='input' type={props.type} placeholder={props.placeholder} value={props.value} onChange={(event) => onChangeHandler(event.target.value) } />
        {
          // icon 인풋이 존재하면
          props.icon && (
            <div className="input-box-icon" onClick={props.buttonHandler}>
              {
                props.icon === INPUT_ICON.ON ? (<div className="input-on-icon"></div>) :
                props.icon === INPUT_ICON.OFF ? (<div className="input-off-icon"></div>) :
                props.icon === INPUT_ICON.ARROW ? (<div className="input-right-arrow-icon"></div>) :
                (<></>)
              }
            </div>
          )
        }
      </div>
      {props.helper && (<div className="input-box-helper">{props.helper}</div>)}
    </div>
  )
}
