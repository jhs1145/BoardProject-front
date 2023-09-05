import { create } from "zustand";

interface User {
    email : string;
    nickname : string;
    profileImageUrl : string;
}

interface UserStore {
    user : User | null; // user 상태변수
    setUser : (user: User | null ) => void; // 반환타입은 void, user 상태변수를 반환하여 세팅함.
}

//! UserStore 제네릭 타입에 합수로 매개변수를 전달, set을 받아옴
const useStore = create<UserStore>( (set) => ({
    user : null, // user의 초기값은 null
    setUser : (user) => set((state) => ({...state, user})), //set 메서드를 실행시키고 현재 state를 매개변수로 받은 user 값으로 세팅한다. 
}));

export default useStore;