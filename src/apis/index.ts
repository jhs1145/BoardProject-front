import axios from 'axios';
import { SignInRequestDto, SignUpRequestDto } from 'src/interfaces/request/auth';
import { PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto } from 'src/interfaces/request/board';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from 'src/interfaces/request/user';
import { SignInResponseDto, SignUpResponseDto } from 'src/interfaces/response/auth';
import { DeleteBoardResponseDto, GetBoardResponseDto, GetCommentListResponseDto, GetCurrentBoardResponseDto, GetFavoriteListResponseDto, GetSearchBoardResponseDto, GetTop3ResponseDto, GetUserListResponseDto, PatchBoardResponseDto, PostBoardResponseDto, PostCommentResponseDto, PutFavoriteResponseDto } from 'src/interfaces/response/board';
import ResponseDto from 'src/interfaces/response/response.dto';
import { GetPopularListResponseDto, GetRelationListResponseDto } from 'src/interfaces/response/search';
import { GetLoginUserResponseDto, GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from 'src/interfaces/response/user';

const API_DOMAIN = 'http://13.209.10.216:4040/api/v1';

const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;

const GET_TOP3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_CURRENT_BOARD_LIST_URL = (section : number) => `${API_DOMAIN}/board/current-board/${section}`;
const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular`;

const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, relationWord? : string) => relationWord ? `${API_DOMAIN}/board/search/${searchWord}/${relationWord}` : `${API_DOMAIN}/board/search/${searchWord}`;
const GET_RELATION_LIST_URL = (searchWord: string) => `${API_DOMAIN}/search/relation/${searchWord}`;

const GET_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment-list`;

const PUT_FAVORITE_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite`;
const POST_COMMENT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment`;

const PATCH_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const DELETE_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;

const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
const GET_USER_BOARD_LIST_URL = (email: string) => `${API_DOMAIN}/board/user-list/${email}`;

const PATCH_USER_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const PATCH_USER_PROFILE_URL = () => `${API_DOMAIN}/user/profile`;

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const UPLOAD_FILE = () => 'http://13.209.10.216:4040/file/upload';

export const signUpRequest = async (data: SignUpRequestDto) => {
  const result = 
    await axios.post(SIGN_UP_URL(), data).then((response) => {
      const responsebody: SignUpResponseDto = response.data; // SignUpResponseDto 타입으로 받아온다 는뜻  / response.data : 포스트맨 요청의 결과값
      const { code } = responsebody; //
      return code;
    }).catch((error) => {
      const responsebody : ResponseDto = error.response.data;
      const { code } = responsebody; //
      return code;
    });
  
    return result;
}

export const signInRequest = async (data: SignInRequestDto) => {
  const result = 
    await axios.post(SIGN_IN_URL(), data)
    .then((response) => {
      const responsebody : SignInResponseDto = response.data;
      return responsebody;
    })
    .catch((error) => {
      const responsebody : ResponseDto = error.response.data;
      return responsebody;
    });
    return result;
}

export const getTop3BoardListRequest = async () => {
  const result = await axios.get(GET_TOP3_BOARD_LIST_URL())
  .then((response) => {
    const responsebody : GetTop3ResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getCurrentBoardListRequest = async (section : number) => {
  const result = await axios.get(GET_CURRENT_BOARD_LIST_URL(section))
  .then((response) => {
    const responsebody : GetCurrentBoardResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getPopularListRequest = async () => {
  const result = await axios.get(GET_POPULAR_LIST_URL())
  .then((response) => {
    const responsebody : GetPopularListResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getSearchBoardListRequest = async (searchWord: string, relationWord? : string) => {
  const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, relationWord))
  .then((response) => {
    const responsebody : GetSearchBoardResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getRelationListRequest = async (searchWord: string) => {
  const result = await axios.get(GET_RELATION_LIST_URL(searchWord)).then((response) => {
    const responsebody : GetRelationListResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getBoardRequest = async (boardNumber: number | string) => {
  const result = await axios.get(GET_BOARD_URL(boardNumber))
  .then((response) => {
    const responsebody : GetBoardResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getFavoriteListRequest = async (boardNumber: number | string) => {
  const result = await axios.get(GET_FAVORITE_LIST_URL(boardNumber))
  .then((response) => {
    const responsebody : GetFavoriteListResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getCommentListRequest = async (boardNumber: number | string) => {
  const result = await axios.get(GET_COMMENT_LIST_URL(boardNumber))
  .then((response) => {
    const responsebody : GetCommentListResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const putFavoriteRequest = async (boardNumber: number | string, token : string) => {
  const result = await axios.put(PUT_FAVORITE_URL(boardNumber), { }, { headers : {'Authorization' : `Bearer ${token}`} }).then((response) => {
    const responsebody : PutFavoriteResponseDto = response.data;
    const {code} = responsebody;
    return code;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    const { code } = responsebody;
    return code;
  });
  return result;
}

export const postCommentRequest = async (boardNumber: number | string, data: PostCommentRequestDto, token : string) => {
  const result = await axios.post(POST_COMMENT_URL(boardNumber), data, { headers : {'Authorization' : `Bearer ${token}`} }).then((response) => {
    const responsebody : PostCommentResponseDto = response.data;
    const {code} = responsebody;
    return code;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    const { code } = responsebody;
    return code;
  });
  return result;
}

export const patchBoardRequest = async (boardNumber: number | string, data: PatchBoardRequestDto, token : string) => {
  const result = await axios.patch(PATCH_BOARD_URL(boardNumber), data, { headers : {'Authorization' : `Bearer ${token}`} })
  .then((response) => {
    const responsebody : PatchBoardResponseDto = response.data;
    const {code} = responsebody;
    return code;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    const {code} = responsebody;
    return code;
  });
  return result;
}

export const deleteBoardRequest = async (boardNumber: number | string, token : string) => {
  const result = await axios.delete(DELETE_BOARD_URL(boardNumber), { headers : {'Authorization' : `Bearer ${token}`} }).then((response) => {
    const responsebody : DeleteBoardResponseDto = response.data;
    const {code} = responsebody;
    return code;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    const {code} = responsebody;
    return code;
  });
  return result;
}

export const getUserRequest = async (email: string) => {
  const result = await axios.get(GET_USER_URL(email))
  .then((response) => {
    const responsebody : GetUserResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getUserBoardListRequest = async (email: string) => {
  const result = await axios.get(GET_USER_BOARD_LIST_URL(email))
  .then((response) => {
    const responsebody : GetUserListResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const getSignInUserRequest = async (token : string) => {
  const header = { headers : { 'Authorization' : `Bearer ${token}`} };
  const result = await axios.get(GET_SIGN_IN_USER_URL(), header)
  .then((response) => {
    const responsebody : GetLoginUserResponseDto = response.data;
    return responsebody;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    return responsebody;
  });
  return result;
}

export const uploadFileRequest = async (data : FormData) => {
  const result = await axios.post(UPLOAD_FILE(), data, { headers : { 'Content-Type' : 'multipart/form-data' } })
  .then((response) => {
    const imageUrl : string = response.data;
    return imageUrl;
  })
  .catch((error) => null);
  return result;
}

export const postBoardRequest = async (data: PostBoardRequestDto, token : string) => {
  const result = await axios.post(POST_BOARD_URL(), data, { headers : { 'Authorization' : `Bearer ${token}` } })
  .then((response) => {
    const responsebody : PostBoardResponseDto = response.data;
    const { code } = responsebody;
    return code;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    const { code } = responsebody;
    return code;
  });
  return result;
}

export const patchUserNicknameRequest = async ( data : PatchNicknameRequestDto, token : string) => {
  const result = await axios.patch(PATCH_USER_NICKNAME_URL(), data, { headers : { 'Authorization' : `Bearer ${token}` } })
  .then((response) => {
    const responsebody : PatchNicknameResponseDto = response.data;
    const { code } = responsebody;
    return code;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    const { code } = responsebody;
    return code;
  });
  return result;
}

export const patchUserProfileRequest = async (data: PatchProfileImageRequestDto, token : string) => {
  const result = await axios.patch(PATCH_USER_PROFILE_URL(), data, { headers : { 'Authorization' : `Bearer ${token}` } })
  .then((response) => {
    const responsebody : PatchProfileImageResponseDto = response.data;
    const { code } = responsebody;
    return code;
  })
  .catch((error) => {
    const responsebody : ResponseDto = error.response.data;
    const { code } = responsebody;
    return code;
  });
  return result;
}