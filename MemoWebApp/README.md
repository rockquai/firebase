###### firebase

# 메모 웹 애플리케이션 만들기

[https://memowebapp-2db2a.firebaseapp.com/] (https://memowebapp-2db2a.firebaseapp.com/)

## To Do
1. 인증기능을 이용한 구글창 호출
	- `성공` 메모리스트 출력
	- `실패` 구글창 다시 호출
2. 메모 저장 기능
3. 메모 한건 출력 기능
4. 메모 수정 기능
5. 메모 삭제 기능

### 1. 인증기능을 이용한 구글창 호출

#### 인증기능 설정

```
// Initialize Firebase 구문에 삽입
auth = firebase.auth();
var authProvider = new firebase.auth.GoogleAuthProvider();
auth.signInWithPopup(authProvider);

```

#### `성공` , `실패` 출력

```
auth.onAuthStateChanged(function(user) {
	if ( user ) {
		// 인증 성공
		console.log( 'success' );
		console.log( user );
	} else {
		// 인증 실패 - 인증 팝업창 노출
		auth.signInWithPopup(authProvider);
	}
});
```

#### json 구조 예시

```
{
	memos :  {
		uid : { text : '텍스트', 작성일 : '작성일', 제목 : '제목'},
		uid : { text : '텍스트', 작성일 : '작성일', 제목 : '제목'},
		uid : { text : '텍스트', 작성일 : '작성일', 제목 : '제목'}
	}
}
```

#### 데이터 구조 정의

```
{
	txt : '메모에 본문',
	updateDate : '업데이트 날짜',
	createData : '생성한 날짜'
} 
```