import ResponseDto from '../response.dto';

export default interface GetFavoriteListResponseDto extends ResponseDto {
    favoriteList : FavoriteListResponseDto[];
}

export interface FavoriteListResponseDto{
    Email : string;
    nickname : string;
    profileImageUrl : string;
}