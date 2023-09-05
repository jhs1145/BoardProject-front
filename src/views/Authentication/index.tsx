import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDaumPostcodePopup, Address } from 'react-daum-postcode';
import { useCookies } from 'react-cookie';
import { useUserStore } from 'src/stores';
import InputBox from 'src/components/InputBox';
import { signInMock, userMock } from 'src/mocks';
import { INPUT_ICON, MAIN_PATH, emailPattern, telNumberPattern } from 'src/constants';
import './style.css';
import { SignInRequestDto, SignUpRequestDto } from 'src/interfaces/request/auth';
import { getSignInUserRequest, signInRequest, signUpRequest } from 'src/apis';
import { SignInResponseDto } from 'src/interfaces/response/auth';
import ResponseDto from 'src/interfaces/response/response.dto';
import { GetLoginUserResponseDto } from 'src/interfaces/response/user';
//!          component          //
// description: 인증 화면 //
export default function Authentication() {

  //! 리터럴 타입으로 선언
  //!          state          //
  // 쿠키 상태 정보를 불러오거나 세팅
  const [cookies, setCookie] = useCookies();
  // description: 로그인 혹은 회원가입 뷰 상태 /
  const [view,setView ] = useState<'sign-in' | 'sign-up'>('sign-in');

  //!          function          //
  // description: 페이지 이동을 위한 네비게이트 함수 //
  const navigator = useNavigate();

    //!          component          //
  // description: 로그인 카드 컴포넌트 //
  //! 첫글자 대문자는 컴포넌트 라는 뜻. 밖에 선언와 안에 선언은 차이가 있음
  //! 내부선언 : 지역변수, 상태값을 내부에서 사용가능
  //! 외부선언 : 내부 지역변수나 상태값을 공유하려면 외부선언된 함수에 매개변수로 넘겨줘야 사용가능
  const SignInCard = () => {
    
    //!          state          //
    // description: 로그인 유저 정보 상태 //
    const {setUser} = useUserStore();
    
    // description: 비밀번호 입력 값 상태 //
    const [password, setPassword] = useState<string>(signInMock.password);
    // description: 이메일 입력 값 상태 //
    const [email, setEmail] = useState<string>(signInMock.email);
    // description: 비밀번호 인풋 타입 상태 //
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // description: 로그인 에러 상태 //
    const [error, setError] = useState<boolean>(false);

    //!           function              //
    // 로그인 응답 처리 함수
    const sigInResponseHandler = (result : SignInResponseDto | ResponseDto ) => {
        const { code } = result;
        if(code === 'DM') setError(true);
        if(code === 'DE') alert("데이터베이스 에러");
        if(code !== 'SU') return;

        const { token, expiredTime } = result as SignInResponseDto;
        // getSignInUserRequest(token).then(getSignInUserHandler);

        const now = new Date().getTime(); // getTime() : 날짜를 숫자로 바꿈
        const expires = new Date(now + expiredTime * 1000);
        setCookie("accessToken", token, { expires, path: MAIN_PATH }); // 만료없이는 쿠키가 안없어짐 , 쿠키 만료시간 지정
        navigator(MAIN_PATH);
    };

    //!          event handler          //
    // description: 회원가입 이동 클릭 이벤트 //
    const onSignUpClickHandler = () =>{
      setView('sign-up')
    }
    // description: 비밀번호 타입 변경 버튼 클릭 이벤트 //
    const onPasswordIconClickHandler = () =>{
      setShowPassword(!showPassword);
    }
    // description: 로그인 버튼 클릭 이벤트 //
    const onSignInClickHandler = async () => {
      setError(false);
      
      const data: SignInRequestDto = {
        email,
        password
      }

      signInRequest(data).then(sigInResponseHandler);
    }

    //!          render          //
    return(
      <div className='auth-card'>
      <div className="auth-card-top">
        <div className="auth-card-top-text-container">
          <div className="auth-card-top-text">로그인</div>
        </div>
        <div className="auth-card-top-input-container">
          <InputBox label ='이메일주소' type='text' placeholder='이메일 주소를 입력해주세요' error={error} value={email} setValue={setEmail}/>
          <InputBox label ='비밀번호'type={showPassword ? 'text' : 'password'} placeholder='비밀번호를 입력해주세요' icon={showPassword? INPUT_ICON.ON : INPUT_ICON.OFF} 
                    buttonHandler={onPasswordIconClickHandler} error={error} value={password} setValue={setPassword}/>
        </div>
      </div>
      <div className="auth-card-bottom">
        {
          error ? (<div className="auth-card-bottom-error-message"> 이메일 주소 또는 비밀번호를 잘못 입력했습니다. 
                    <br/> 입력하신 내용을 다시 확인해주세요.</div>) : (<div></div>)
        }
        <div className="auth-card-bottom-button" onClick={onSignInClickHandler}>로그인</div>
        <div className="auth-card-bottom-text">신규 사용자이신가요? 
          <span className="auth-empahsis" onClick={onSignUpClickHandler}>회원가입</span>
        </div>
      </div>
    </div>
    )
  }
  const SignUpCard = () => {

    //!         state          //
    // description: 다음 포스트 (우편번호검색) 팝업 상태 //
    const open = useDaumPostcodePopup();
    // description: 회원가입 카드 페이지 상태 //
    const [page, setPage] = useState<1|2>(1);
    // description: 비밀번호 인풋 타입 상태 //
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // description: 비밀번호 확인 인풋 타입 상태 //
    const [showPasswordCheck, setShowPasswordCheck] = useState<boolean>(false);
    
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordCheckError, setPasswordCheckError] = useState<boolean>(false);
    const [emailPatternError, setEmailPatternError] = useState<boolean>(false);
    const [emailDuplicationError, setEmailDuplicationError] = useState<boolean>(false);
    const [nicknameError, setNicknameError] = useState<boolean>(false);
    // 닉네임 중복 에러 상태
    const [nicknameDuplicationError, setNicknameDuplicationError] = useState<boolean>(false);
    const [telNumberError, setTelNumberError] = useState<boolean>(false);
    const [telNumberDuplicationError, setTelNumberDuplicationError] = useState<boolean>(false);
    const [addressError, setAddressError] = useState<boolean>(false);

    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [addressDetail, setAddressDetail] = useState<string>('');
    
    //!          function          //
    // description: 페이지1에서 페이지2로 이동 시 검증 함수 //
    const checkPage1=() =>{
      //! 조건을 넣으면 해당하는 값이 자동으로 반환되는데
      //! setState 함수는 해당 핸들러 함수가 종료된 후에 상태가 변경된다.

      const emailPatternFlag = !emailPattern.test(email);
      const passwordFlag = password.length < 8;
      const passwordCheckFlag = password !== passwordCheck;

      setEmailPatternError(emailPatternFlag);
      setPasswordError(passwordFlag);
      setPasswordCheckError(passwordCheckFlag);

      if(!emailPatternFlag && !passwordFlag && !passwordCheckFlag)
        setPage(2);

    }
    const checkPage2=() =>{
      setTelNumberError(!telNumber);
      const telNumberFlag = !telNumberPattern.test(telNumber);
      setTelNumberError(telNumberFlag);

      //! 빈문자열일 경우
      setNicknameError(!nickname);
      setAddressError(!address);
      // if(!telNumberFlag && nickname && address) setView('sign-in');
      
      // description: 백엔드로 데이터 전송 (회원가입 포맷에 맞춰서) //
      const data: SignUpRequestDto = {
        email,
        password,
        nickname,
        telNumber,
        address,
        addressDetail
      }

      signUpRequest(data).then(signUpResponseHandler);

    }
    const signUpResponseHandler= (code : string) =>{
      // code의 값이 SU : 성공 //
      if(code === "SU") setView('sign-in');

      // EE : 존재하는 이메일 //
      if(code === "EE"){
        setEmailDuplicationError(true);
        setPage(1);
      } 

      // EN : 존재하는 닉네임 //
      if(code === "EN"){
        setNicknameDuplicationError(true);
      }

      // ET : 존재하는 폰번호 //
      if(code === "ET"){
        setTelNumberDuplicationError(true);
      }
      // DE : DB ERROR  //
      if(code === "DE") alert("데이터베이스 오류");
    }

    const onSignInClickHandler = () =>{
      setView('sign-in');
    }
    const onButtonClickHandler = () =>{
      setEmailPatternError(false);
      setPasswordError(false);
      setPasswordCheckError(false);
      setNicknameError(false);
      setNicknameDuplicationError(false);
      setTelNumberError(false);
      setTelNumberDuplicationError(false);
      if ( page === 1 ) checkPage1();
      if ( page == 2 ) checkPage2();
    }
    const onPasswordIconClickHandler = () =>{
      setShowPassword(!showPassword);
    }
    const onPasswordCheckClickHandler = () =>{
      setShowPasswordCheck(!showPasswordCheck);
    }
    
    const onAddressIconClickHandler = () => {
      open({onComplete});
    }
    const onComplete = (data: Address) => {
      const address = data.address;
      setAddress(address);
    }
    return(
      <div className='auth-card'>
        <div className="auth-card-top">
          <div className="auth-card-top-text-container">
            <div className="auth-card-top-text">회원가입</div>
            <div className="auth-card-top-text-opacity">{`${page}/2`}</div>
          </div>
          <div className="auth-card-top-input-container">
            { page ===1 ? (
                <>
                  <InputBox label ='이메일 주소*' type='text' placeholder='이메일 주소를 입력해주세요' error={emailDuplicationError || emailPatternError } 
                            helper={emailPatternError? '이메일 주소 포맷이 옳지않습니다.' : emailDuplicationError ? '중복되는 이메일 주소입니다.' : ''} value={email} setValue={setEmail}/>

                  <InputBox label ='비밀번호*' type={showPassword ? 'text' : 'password'} placeholder='비밀번호를 입력해주세요' 
                            icon={showPassword? INPUT_ICON.ON : INPUT_ICON.OFF} buttonHandler={onPasswordIconClickHandler} 
                            error={passwordError} helper={passwordError? '비밀번호는 8자 이상 입력해주세요.':''} value={password} setValue={setPassword}/>

                  <InputBox label ='비밀번호 확인*' type={showPasswordCheck ? 'text' : 'password'} placeholder='비밀번호를 다시 입력해주세요' 
                            icon={showPasswordCheck? INPUT_ICON.ON : INPUT_ICON.OFF} buttonHandler={onPasswordCheckClickHandler}
                            error={passwordCheckError} helper={passwordCheckError? '비밀번호가 일치하지않습니다.':''} value={passwordCheck} setValue={setPasswordCheck}/>
                </>
              ) :
              (
                <>
                  <InputBox label ='닉네임*' type='text' placeholder='닉네임을 입력해주세요' error={nicknameError || nicknameDuplicationError} helper={nicknameError? '닉네임을 입력해주세요.': nicknameDuplicationError ? '중복되는 닉네임입니다.' : ''} 
                            value={nickname} setValue={setNickname}/>
                  <InputBox label ='핸드폰 번호*' type='text' placeholder='핸드폰 번호를 입력해주세요'  error={telNumberError || telNumberDuplicationError} helper={telNumberError? '숫자만 입력해주세요.': telNumberDuplicationError? '중복되는 번호입니다.' : ''} 
                            value={telNumber} setValue={setTelNumber}/>
                  <InputBox label ='주소*' type='text' placeholder='우편번호 찾기' icon={INPUT_ICON.ARROW}  error={addressError} helper={addressError? '우편번호를 선택해주세요.':''} 
                            value={address} setValue={setAddress} buttonHandler={onAddressIconClickHandler}/>
                  <InputBox label ='상세 주소*' type='text' placeholder='상세주소를 입력해주세요' value={addressDetail} setValue={setAddressDetail}/>
                </>
              )
            }


          </div>
        </div>
        <div className="auth-card-bottom">
          <div className="auth-card-bottom-button" onClick={onButtonClickHandler}>
            {page === 1 ? <div>다음 단계</div> : <div>회원가입</div> }
          </div>
          <div className="auth-card-bottom-text">
            이미 계정이 있으신가요? <span className="auth-empahsis" onClick={onSignInClickHandler}>로그인</span>
          </div>
        </div>
      </div>
    )
    
  }

  return (
    <div id='auth-wrapper'>
      <div className="auth-left">
        <div className="auth-left-icon"></div>
        <div className="auth-left-text-container">
          <div className="auth-left-text">환영합니다</div>
          <div className="auth-left-text">THIS BOARD 입니다.</div>
        </div>
      </div>
      <div className="auth-right">
          {view === 'sign-in' ? (<SignInCard/>) : (<SignUpCard />) }
      </div>
    </div>
  )
}
