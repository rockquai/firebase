'use strict';

	var auth, database, userInfo, selectedKey;
        // Initialize Firebase
        var config = {
          apiKey: "AIzaSyBVF7tEEELygwZq7PkoeCbKmCiRKWcoZiA",
          authDomain: "memowebapp-2db2a.firebaseapp.com",
          databaseURL: "https://memowebapp-2db2a.firebaseio.com",
          storageBucket: "memowebapp-2db2a.appspot.com",
          messagingSenderId: "983708128773"
        };
        firebase.initializeApp(config);
        auth = firebase.auth();
        database = firebase.database();
        var authProvider = new firebase.auth.GoogleAuthProvider();
        
        auth.onAuthStateChanged(function(user) {
          if ( user ) {
            // 인증 성공
            console.log( 'success' );
            console.log( user );
            // 메모리스트 출력
            userInfo = user;
            get_memo_list();
          } else {
            // 인증 실패 - 인증 팝업창 노출
            auth.signInWithPopup(authProvider);
          }
        });

        function get_memo_list() {
          var memoRef = database.ref('memos/' + userInfo.uid);
          // 비동기로 콜백으로 데이터를 받아온다
          memoRef.on('child_added', on_child_added);
          memoRef.on('child_changed', on_child_changed);
        }

        // 데이터 수정 함수 
        function on_child_changed(data) {
          var key   = data.key;
          var txt   = data.val().txt;
          var title = txt.substr(0, txt.indexOf('\n'));

          $("#"+key+ " > .title").text(title);
          $("#"+key+ " > .txt").text(txt);
        }

        // 데이터 추가 함수
        function on_child_added(data) {
          /* 데이터 구조 정의
            {
              txt : '메모에 본문',
              updateDate : '업데이트 날짜',
              createData : '생성한 날짜'
            }       
          */

          var key      = data.key;
          var memoData = data.val();
          var txt      = memoData.txt;
          var title    = txt.substr(0, txt.indexOf('\n')); // 첫번째 줄에 있는 첫번째 글자가 제목이 된다.
          var firstTxt = txt.substr(0, 1);

          var html =
           "<li id='"+key+"' class=\"collection-item avatar\" onclick=\"fn_get_data_one(this.id);\" >" +
           "<i class=\"material-icons circle red\">" + firstTxt + "</i>" +
           "<span class=\"title\">" + title + "</span>" +
           "<p class='txt'>" + txt + "<br>" +
           "</p>" +
           "<a href=\"#!\" onclick=\"fn_delete_data('"+key+"');\" class=\"secondary-content\"><i class=\"material-icons\">grade</i></a>" +
           "</li>";
           $(".collection").append(html);
        }

        function fn_get_data_one(key) {
          selectedKey = key;
          var memoRef = database.ref('memos/' + userInfo.uid + '/' + key)
                                .once('value').then(function(snapshot) {
                                  $(".textarea").val(snapshot.val().txt);
                                });
        }

        // 데이터 삭제 버튼
        function fn_delete_data(key) {
          if ( !confirm('삭제하시겠습니까?') ) {
            return;
          }

          var memoRef = database.ref('memos/' + userInfo.uid + '/' + key);
          // firebase의 remove 메소드
          memoRef.remove();
          // jquery의 remove 메소드
          $("#"+key).remove();
          initMemo();
        }

        function save_data() {
          var memoRef = database.ref('memos/' + userInfo.uid);
          var txt = $(".textarea").val();

          if ( txt == '' ) {
            return;
          }

          if ( selectedKey ) {
            memoRef = database.ref('memos/' + userInfo.uid + '/' + selectedKey);
            memoRef.update({
              txt : txt,
              createDate : new Date().getTime(),
              updateDate : new Date().getTime()
            });
          } else {
            //push
            memoRef.push({
              txt : txt,
              createDate : new Date().getTime()
            });
          }
        }

        // 신규 메모 함수
        function initMemo() {
          $(".textarea").val('');
          // 초기화 
          selectedKey = null;
        }

        $(function() {
          $(".textarea").blur(function() {
            save_data();
          });
        });