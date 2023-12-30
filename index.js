const express = require('express');
const app = express();

//viewディレクトリがどこからでも実行しても動くようにする（１）
const path = require('path');

//uuid https://github.com/uuidjs/uuid {元の変数名：変更後の名前}
const { v4: uuid } = require('uuid');
// uuid();

//method override https://www.npmjs.com/package/method-override POSTを別のメソッドに変換
const methodOverride = require('method-override');



//フォームから送られてきたデータをパースできる
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//method override
app.use(methodOverride('_method'));

//viewディレクトリがどこからでも実行しても動くようにする（２）
app.set('views', path.join(__dirname, 'views'));

//expressにejsを使う宣言
app.set('view engine', 'ejs');


//ダミーデータ
//deleteのメソッドのためにconstからletに変更
let comments = [
    {
        // id:1,
        id: uuid(),
        username: 'yamada',
        comment:'今日は何をしますか'
    },
    {
        // id: 2,
        id: uuid(),
        username: 'suzuki',
        comment:'散歩にでかけます'
    },
    {
        // id: 3,
        id: uuid(),
        username: 'tanaka',
        comment:'買い物にいきます。yamadaさんは？'
    },
    {
        // id: 4,
        id: uuid(),
        username: 'wanwan',
        comment:'わんわんわん'
    },
];

//コメント表示
app.get('/comments', (req, res) =>{
    //{ comments : comments }と同じ。同じ名前なので省略して { comments }にできる。
    res.render('comments/index', { comments });
});

//新規コメントフォーム
app.get('/comments/new', (req,res) =>{
    res.render('comments/new');
});

//新規コメントを既存コメントにプッシュ
app.post('/comments', (req,res) => {

    //テスト用
    // console.log(req.body);
    // res.send('OK');

    const { username, comment } = req.body;
    // comments.push( { username, comment });
    // res.send('OK');
    //res.sendでは、更新ボタンを押すと毎回POSTすることになるので、redirectをつかう
    //https://expressjs.com/ja/4x/api.html#res.redirect

    //uuid()を追加
    comments.push( { username, comment, id: uuid() });
    res.redirect('/comments');
    // POST Status code 302 Location: /comments => GET status code 200
});

//特定のコメントを表示
app.get('/comments/:id', (req,res) =>{
    const { id } = req.params;
    // const comment = comments.find(c => c.id === parseInt(id));

    //uuid()はstringのため、parseIntは削除
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', { comment });
});


//特定のコメントを編集する　https://expressjs.com/ja/4x/api.html#app.METHOD
app.patch('/comments/:id', (req, res) =>{
    const { id } = req.params;
    // console.log(req.body.comment);
    //新しいコメントがbodyに入ってくるので、それをnewCommentTextとする
    const newCommentText = req.body.comment;
    //idと一致するコメントを探す
    const foundComment = comments.find(c => c.id === id);
    //その中身を更新する
    foundComment.comment = newCommentText;
    res.redirect('/comments');
    // res.send('PATCH');
});


//コメント編集のフォーム
app.get('/comments/:id/edit',(req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', { comment });
});


//コメントを削除する
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
});



app.get('/tacos', (req,res) => {
    res.send('GET /tacos response');
});

// app.post('/tacos', (req,res) => {
//     console.log(req.body);
//     //https://expressjs.com/ja/4x/api.html#req.body
//     //req.bodyのデフォルトはundefined. express.json(), express.urlencoded()を使う
//     res.send('GET /tacos response');
// });

app.post('/tacos', (req,res) => {
    const { meat, qty } = req.body;
    res.send(`${qty} ${meat} どうぞ`);
});
// 4 polk どうぞ　がページに表示

app.listen(3000, () => {
    console.log('ポート3000で待ち受け中...')
});



//ベースとなるURL  /comments

// Index   GET     /comments          - コメント一覧を取得
// New     GET     /comments/new      - 新しいコメントを作成するためのフォーム
// Create  POST    / comments         - 新しいコメントをサーバー側で作成
// Show    GET     /comments/:id      - 特定のコメントを一つ取得
// Edit    GET     /comments/:id/edit - 新しいコメントを編集するためのフォーム
// Update  PATCH   /comments/:id      - 特定のコメントをサーバー側で更新
// Destroy DELETE  /comments/:id      - 特定のコメントをサーバー側で削除

